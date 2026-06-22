const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { sanitizeUser } = require('../utils/helpers');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const [[users], [pharmacies], [hospitals], [prescriptions]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS c FROM users'),
      pool.query('SELECT COUNT(*) AS c FROM pharmacies WHERE is_active=1'),
      pool.query('SELECT COUNT(*) AS c FROM hospitals WHERE is_active=1'),
      pool.query('SELECT COUNT(*) AS c FROM prescriptions'),
    ]);
    res.json({
      success: true,
      data: {
        totalUsers: users[0].c,
        activePharmacies: pharmacies[0].c,
        hospitals: hospitals[0].c,
        totalPrescriptions: prescriptions[0].c,
      },
    });
  } catch (err) { next(err); }
});

router.get('/users', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, role, first_name, last_name, phone, language, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.patch('/users/:id/toggle', async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User status updated' });
  } catch (err) { next(err); }
});

router.post('/users', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role, language = 'en' } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES (?,?,?,?,?,?,?)',
      [email, hash, role, firstName, lastName, phone, language]
    );
    if (role === 'patient') await pool.query('INSERT INTO patient_profiles (user_id) VALUES (?)', [r.insertId]);
    res.status(201).json({ success: true, data: { id: r.insertId } });
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
