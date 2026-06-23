const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const { getUserPermissions } = require('../services/permission.service');
const { sanitizeUser } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../services/email.service');
const { sendWelcomeSms } = require('../services/sms.service');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, language = 'en', dateOfBirth, gender } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, passwordHash, 'patient', firstName, lastName, phone || null, language]
    );

    const userId = result.insertId;
    await pool.query(
      'INSERT INTO patient_profiles (user_id, date_of_birth, gender) VALUES (?, ?, ?)',
      [userId, dateOfBirth || null, gender || null]
    );

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = sanitizeUser(users[0]);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    sendWelcomeEmail(user).catch(() => {});
    sendWelcomeSms(user).catch(() => {});

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

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.is_blocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact administrator.' });
    }
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is inactive. Contact administrator.' });
    }

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

    const permissions = await getUserPermissions(user.id, user.role);
    res.json({ success: true, data: { user, profile, permissions } });
  } catch (err) {
    next(err);
  }
});

router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, language, password } = req.body;
    await pool.query(
      'UPDATE users SET first_name=?, last_name=?, phone=?, language=? WHERE id=?',
      [firstName, lastName, phone, language, req.user.id]
    );
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, req.user.id]);
    }
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
});

router.get('/permissions', authenticate, async (req, res, next) => {
  try {
    const permissions = await getUserPermissions(req.user.id, req.user.role);
    if (!permissions) {
      return res.status(404).json({ success: false, message: 'Permissions not found' });
    }
    res.json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
