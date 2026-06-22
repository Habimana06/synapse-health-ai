const express = require('express');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { getPatientProfileId } = require('../utils/helpers');

const router = express.Router();

router.use(authenticate);

router.get('/profile', authorize('patient'), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.language,
              pp.* FROM users u
       JOIN patient_profiles pp ON pp.user_id = u.id WHERE u.id = ?`,
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

router.put('/profile', authorize('patient'), async (req, res, next) => {
  try {
    const { firstName, lastName, phone, language, dateOfBirth, gender, bloodType, emergencyContact, emergencyPhone } = req.body;
    await pool.query(
      'UPDATE users SET first_name=?, last_name=?, phone=?, language=? WHERE id=?',
      [firstName, lastName, phone, language, req.user.id]
    );
    await pool.query(
      `UPDATE patient_profiles SET date_of_birth=?, gender=?, blood_type=?, emergency_contact=?, emergency_phone=?
       WHERE user_id=?`,
      [dateOfBirth, gender, bloodType, emergencyContact, emergencyPhone, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) { next(err); }
});

router.get('/allergies', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [rows] = await pool.query('SELECT * FROM allergies WHERE patient_id = ? ORDER BY created_at DESC', [pid]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/allergies', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const { allergen, reaction, severity, recordedAt } = req.body;
    const [r] = await pool.query(
      'INSERT INTO allergies (patient_id, allergen, reaction, severity, recorded_at) VALUES (?,?,?,?,?)',
      [pid, allergen, reaction, severity || 'moderate', recordedAt || null]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.get('/history', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [rows] = await pool.query('SELECT * FROM medical_history WHERE patient_id = ? ORDER BY created_at DESC', [pid]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/labs', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [rows] = await pool.query('SELECT * FROM lab_results WHERE patient_id = ? ORDER BY test_date DESC', [pid]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/vaccinations', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [rows] = await pool.query('SELECT * FROM vaccinations WHERE patient_id = ? ORDER BY administered_date DESC', [pid]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/prescriptions', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [rows] = await pool.query(
      `SELECT p.*, u.first_name AS doctor_first_name, u.last_name AS doctor_last_name
       FROM prescriptions p
       JOIN doctor_profiles dp ON p.doctor_id = dp.id
       JOIN users u ON dp.user_id = u.id
       WHERE p.patient_id = ? ORDER BY p.prescribed_at DESC`,
      [pid]
    );
    for (const rx of rows) {
      const [items] = await pool.query(
        `SELECT pi.*, m.name AS medicine_name FROM prescription_items pi
         JOIN medicines m ON pi.medicine_id = m.id WHERE pi.prescription_id = ?`,
        [rx.id]
      );
      rx.items = items;
    }
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/dashboard', authorize('patient'), async (req, res, next) => {
  try {
    const pid = await getPatientProfileId(req.user.id);
    const [[allergies], [history], [prescriptions], [labs]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS c FROM allergies WHERE patient_id=?', [pid]),
      pool.query('SELECT COUNT(*) AS c FROM medical_history WHERE patient_id=? AND status IN ("active","chronic")', [pid]),
      pool.query('SELECT COUNT(*) AS c FROM prescriptions WHERE patient_id=? AND status="approved"', [pid]),
      pool.query('SELECT COUNT(*) AS c FROM lab_results WHERE patient_id=? AND status="abnormal"', [pid]),
    ]);
    res.json({
      success: true,
      data: {
        allergies: allergies[0].c,
        activeConditions: history[0].c,
        activePrescriptions: prescriptions[0].c,
        abnormalLabs: labs[0].c,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
