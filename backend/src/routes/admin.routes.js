const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { sendAccountCreatedEmail } = require('../services/email.service');
const { sendAccountCreatedSms } = require('../services/sms.service');

const router = express.Router();

router.use(authenticate, authorize('admin'));

async function createUserProfile(userId, role, body) {
  const { licenseNumber, specialization, hospitalId, pharmacyId, dateOfBirth, gender } = body;

  if (role === 'patient') {
    await pool.query(
      'INSERT INTO patient_profiles (user_id, date_of_birth, gender) VALUES (?, ?, ?)',
      [userId, dateOfBirth || null, gender || null]
    );
  } else if (role === 'doctor') {
    if (!licenseNumber) throw new Error('License number required for doctors');
    await pool.query(
      'INSERT INTO doctor_profiles (user_id, hospital_id, license_number, specialization) VALUES (?, ?, ?, ?)',
      [userId, hospitalId || null, licenseNumber, specialization || null]
    );
  } else if (role === 'pharmacist') {
    if (!licenseNumber) throw new Error('License number required for pharmacists');
    await pool.query(
      'INSERT INTO pharmacist_profiles (user_id, pharmacy_id, license_number) VALUES (?, ?, ?)',
      [userId, pharmacyId || null, licenseNumber]
    );
  }
}

router.get('/dashboard', async (req, res, next) => {
  try {
    const [[users], [pharmacies], [hospitals], [prescriptions], [blocked]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS c FROM users'),
      pool.query('SELECT COUNT(*) AS c FROM pharmacies WHERE is_active=1'),
      pool.query('SELECT COUNT(*) AS c FROM hospitals WHERE is_active=1'),
      pool.query('SELECT COUNT(*) AS c FROM prescriptions'),
      pool.query('SELECT COUNT(*) AS c FROM users WHERE is_blocked=1'),
    ]);
    res.json({
      success: true,
      data: {
        totalUsers: users[0].c,
        activePharmacies: pharmacies[0].c,
        hospitals: hospitals[0].c,
        totalPrescriptions: prescriptions[0].c,
        blockedUsers: blocked[0].c,
      },
    });
  } catch (err) { next(err); }
});

router.get('/users', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, first_name, last_name, phone, language, is_active, is_blocked, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, role, first_name, last_name, phone, language, is_active, is_blocked, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

router.post('/users', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role, language = 'en', licenseNumber, specialization, hospitalId, pharmacyId, dateOfBirth, gender, sendNotifications = true } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    if (!['patient', 'doctor', 'pharmacist', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ success: false, message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES (?,?,?,?,?,?,?)',
      [email, hash, role, firstName, lastName, phone, language]
    );

    if (role !== 'admin') {
      await createUserProfile(r.insertId, role, { licenseNumber, specialization, hospitalId, pharmacyId, dateOfBirth, gender });
    }

    const user = { id: r.insertId, email, role, first_name: firstName, last_name: lastName, phone };

    if (sendNotifications) {
      sendAccountCreatedEmail(user).catch(() => {});
      sendAccountCreatedSms(user).catch(() => {});
    }

    res.status(201).json({ success: true, data: { id: r.insertId }, message: 'User created successfully' });
  } catch (err) {
    if (err.message.includes('License')) return res.status(400).json({ success: false, message: err.message });
    next(err);
  }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    const { firstName, lastName, phone, language, role, password } = req.body;
    const id = req.params.id;

    if (parseInt(id, 10) === req.user.id && role && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change your own admin role' });
    }

    await pool.query(
      'UPDATE users SET first_name=?, last_name=?, phone=?, language=?, role=COALESCE(?, role) WHERE id=?',
      [firstName, lastName, phone, language, role || null, id]
    );

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, id]);
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (err) { next(err); }
});

router.patch('/users/:id/toggle-active', async (req, res, next) => {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
    }
    await pool.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Active status updated' });
  } catch (err) { next(err); }
});

router.patch('/users/:id/toggle-block', async (req, res, next) => {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot block your own account' });
    }
    await pool.query('UPDATE users SET is_blocked = NOT is_blocked WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Block status updated' });
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) { next(err); }
});

router.get('/pharmacies', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pharmacies ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/pharmacies', async (req, res, next) => {
  try {
    const { name, address, city, district, phone, email, latitude, longitude, isPartner, openingHours } = req.body;
    const [r] = await pool.query(
      'INSERT INTO pharmacies (name, address, city, district, phone, email, latitude, longitude, is_partner, opening_hours) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name, address, city, district, phone, email, latitude, longitude, isPartner ? 1 : 0, JSON.stringify(openingHours || {})]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.put('/pharmacies/:id', async (req, res, next) => {
  try {
    const { name, address, city, district, phone, email, latitude, longitude, isPartner, isActive, openingHours } = req.body;
    await pool.query(
      'UPDATE pharmacies SET name=?, address=?, city=?, district=?, phone=?, email=?, latitude=?, longitude=?, is_partner=?, is_active=?, opening_hours=? WHERE id=?',
      [name, address, city, district, phone, email, latitude, longitude, isPartner ? 1 : 0, isActive ? 1 : 0, JSON.stringify(openingHours || {}), req.params.id]
    );
    res.json({ success: true, message: 'Pharmacy updated' });
  } catch (err) { next(err); }
});

router.get('/hospitals', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hospitals ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/hospitals', async (req, res, next) => {
  try {
    const { name, address, city, district, phone, email, latitude, longitude } = req.body;
    const [r] = await pool.query(
      'INSERT INTO hospitals (name, address, city, district, phone, email, latitude, longitude) VALUES (?,?,?,?,?,?,?,?)',
      [name, address, city, district, phone, email, latitude, longitude]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.get('/medicines', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicines ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/medicines', async (req, res, next) => {
  try {
    const { name, genericName, category, description, dosageForm, strength, manufacturer, requiresPrescription } = req.body;
    const [r] = await pool.query(
      'INSERT INTO medicines (name, generic_name, category, description, dosage_form, strength, manufacturer, requires_prescription) VALUES (?,?,?,?,?,?,?,?)',
      [name, genericName, category, description, dosageForm, strength, manufacturer, requiresPrescription ? 1 : 0]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.get('/analytics', async (req, res, next) => {
  try {
    const [events] = await pool.query(
      'SELECT event_type, COUNT(*) AS count FROM analytics_events GROUP BY event_type ORDER BY count DESC'
    );
    const [byRegion] = await pool.query(
      'SELECT region, COUNT(*) AS count FROM analytics_events WHERE region IS NOT NULL GROUP BY region ORDER BY count DESC'
    );
    const [recent] = await pool.query(
      'SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 20'
    );
    const [roleCounts] = await pool.query(
      'SELECT role, COUNT(*) AS count FROM users GROUP BY role'
    );
    res.json({ success: true, data: { events, byRegion, recent, roleCounts } });
  } catch (err) { next(err); }
});

module.exports = router;
