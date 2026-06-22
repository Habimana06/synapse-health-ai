const express = require('express');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { getDoctorProfileId } = require('../utils/helpers');

const router = express.Router();

router.use(authenticate, authorize('doctor'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const [[patients], [prescriptions], [pending]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS c FROM patient_profiles'),
      pool.query('SELECT COUNT(*) AS c FROM prescriptions WHERE DATE(prescribed_at) = CURDATE()'),
      pool.query('SELECT COUNT(*) AS c FROM prescriptions WHERE status = "pending"'),
    ]);
    res.json({ success: true, data: { totalPatients: patients[0].c, todayPrescriptions: prescriptions[0].c, pendingPrescriptions: pending[0].c } });
  } catch (err) { next(err); }
});

router.get('/patients', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT pp.id, u.first_name, u.last_name, u.email, u.phone, pp.date_of_birth, pp.gender, pp.blood_type
       FROM patient_profiles pp JOIN users u ON pp.user_id = u.id ORDER BY u.last_name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/patients/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const [patient] = await pool.query(
      `SELECT pp.*, u.first_name, u.last_name, u.email, u.phone FROM patient_profiles pp
       JOIN users u ON pp.user_id = u.id WHERE pp.id = ?`, [id]
    );
    if (!patient.length) return res.status(404).json({ success: false, message: 'Patient not found' });

    const [allergies, history, labs, prescriptions] = await Promise.all([
      pool.query('SELECT * FROM allergies WHERE patient_id=?', [id]),
      pool.query('SELECT * FROM medical_history WHERE patient_id=? ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM lab_results WHERE patient_id=? ORDER BY test_date DESC', [id]),
      pool.query('SELECT * FROM prescriptions WHERE patient_id=? ORDER BY prescribed_at DESC', [id]),
    ]);

    res.json({
      success: true,
      data: { ...patient[0], allergies: allergies[0], history: history[0], labs: labs[0], prescriptions: prescriptions[0] },
    });
  } catch (err) { next(err); }
});

router.post('/prescriptions', async (req, res, next) => {
  try {
    const doctorId = await getDoctorProfileId(req.user.id);
    const { patientId, diagnosis, notes, items, status = 'approved' } = req.body;

    if (!patientId || !diagnosis || !items?.length) {
      return res.status(400).json({ success: false, message: 'Patient, diagnosis, and items required' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rx] = await conn.query(
        'INSERT INTO prescriptions (patient_id, doctor_id, diagnosis, notes, status) VALUES (?,?,?,?,?)',
        [patientId, doctorId, diagnosis, notes, status]
      );
      for (const item of items) {
        await conn.query(
          'INSERT INTO prescription_items (prescription_id, medicine_id, dosage, frequency, duration, quantity, instructions) VALUES (?,?,?,?,?,?,?)',
          [rx.insertId, item.medicineId, item.dosage, item.frequency, item.duration, item.quantity, item.instructions]
        );
      }
      await conn.commit();
      res.status(201).json({ success: true, data: { id: rx.insertId } });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) { next(err); }
});

router.get('/prescriptions', async (req, res, next) => {
  try {
    const doctorId = await getDoctorProfileId(req.user.id);
    const [rows] = await pool.query(
      `SELECT p.*, u.first_name, u.last_name FROM prescriptions p
       JOIN patient_profiles pp ON p.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE p.doctor_id = ? ORDER BY p.prescribed_at DESC`, [doctorId]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/history', async (req, res, next) => {
  try {
    const { patientId, conditionName, diagnosisDate, status, notes } = req.body;
    const [r] = await pool.query(
      'INSERT INTO medical_history (patient_id, condition_name, diagnosis_date, status, notes, recorded_by) VALUES (?,?,?,?,?,?)',
      [patientId, conditionName, diagnosisDate, status || 'active', notes, req.user.id]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

router.post('/labs', async (req, res, next) => {
  try {
    const { patientId, testName, resultValue, unit, referenceRange, status, testDate, notes } = req.body;
    const [r] = await pool.query(
      'INSERT INTO lab_results (patient_id, test_name, result_value, unit, reference_range, status, test_date, notes, ordered_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [patientId, testName, resultValue, unit, referenceRange, status || 'normal', testDate, notes, req.user.id]
    );
    res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

module.exports = router;
