const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const { sanitizeUser } = require('../utils/helpers');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'patient', language = 'en', licenseNumber, specialization, pharmacyId, hospitalId, dateOfBirth, gender } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const allowedRoles = ['patient', 'doctor', 'pharmacist'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role for registration' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, passwordHash, role, firstName, lastName, phone || null, language]
    );

    const userId = result.insertId;

    if (role === 'patient') {
      await pool.query(
        'INSERT INTO patient_profiles (user_id, date_of_birth, gender) VALUES (?, ?, ?)',
        [userId, dateOfBirth || null, gender || null]
      );
    } else if (role === 'doctor') {
      if (!licenseNumber) return res.status(400).json({ success: false, message: 'License number required for doctors' });
      await pool.query(
        'INSERT INTO doctor_profiles (user_id, hospital_id, license_number, specialization) VALUES (?, ?, ?, ?)',
        [userId, hospitalId || null, licenseNumber, specialization || null]
      );
    } else if (role === 'pharmacist') {
      if (!licenseNumber) return res.status(400).json({ success: false, message: 'License number required for pharmacists' });
      await pool.query(
        'INSERT INTO pharmacist_profiles (user_id, pharmacy_id, license_number) VALUES (?, ?, ?)',
        [userId, pharmacyId || null, licenseNumber]
      );
    }

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = sanitizeUser(users[0]);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const safeUser = sanitizeUser(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    res.json({ success: true, data: { user: safeUser, token } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found' });

    const user = sanitizeUser(users[0]);
    let profile = null;

    if (user.role === 'patient') {
      const [rows] = await pool.query('SELECT * FROM patient_profiles WHERE user_id = ?', [user.id]);
      profile = rows[0] || null;
    } else if (user.role === 'doctor') {
      const [rows] = await pool.query(
        `SELECT dp.*, h.name AS hospital_name FROM doctor_profiles dp
         LEFT JOIN hospitals h ON dp.hospital_id = h.id WHERE dp.user_id = ?`,
        [user.id]
      );
      profile = rows[0] || null;
    } else if (user.role === 'pharmacist') {
      const [rows] = await pool.query(
        `SELECT pp.*, ph.name AS pharmacy_name FROM pharmacist_profiles pp
         LEFT JOIN pharmacies ph ON pp.pharmacy_id = ph.id WHERE pp.user_id = ?`,
        [user.id]
      );
      profile = rows[0] || null;
    }

    res.json({ success: true, data: { user, profile } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
