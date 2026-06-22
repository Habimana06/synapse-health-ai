const { pool } = require('../config/db');

async function getPatientProfileId(userId) {
  const [rows] = await pool.query(
    'SELECT id FROM patient_profiles WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.id || null;
}

async function getDoctorProfileId(userId) {
  const [rows] = await pool.query(
    'SELECT id FROM doctor_profiles WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.id || null;
}

async function getPharmacistProfileId(userId) {
  const [rows] = await pool.query(
    'SELECT id, pharmacy_id FROM pharmacist_profiles WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

module.exports = {
  getPatientProfileId,
  getDoctorProfileId,
  getPharmacistProfileId,
  sanitizeUser,
};
