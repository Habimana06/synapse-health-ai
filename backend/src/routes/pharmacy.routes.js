const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

router.get('/search/medicine', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.address, p.city, p.district, p.phone, p.latitude, p.longitude,
              pi.quantity, pi.unit_price, m.name AS medicine_name, m.strength
       FROM pharmacy_inventory pi
       JOIN pharmacies p ON pi.pharmacy_id = p.id
       JOIN medicines m ON pi.medicine_id = m.id
       WHERE pi.quantity > 0 AND p.is_active = 1 AND (m.name LIKE ? OR m.generic_name LIKE ?)
       ORDER BY p.name`,
      [`%${q}%`, `%${q}%`]
    );

    await pool.query(
      'INSERT INTO analytics_events (event_type, event_data, region) VALUES (?, ?, ?)',
      ['medicine_search', JSON.stringify({ medicine: q }), 'Kigali']
    );

    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const { city, search } = req.query;
    let sql = 'SELECT * FROM pharmacies WHERE is_active = 1';
    const params = [];

    if (city) { sql += ' AND city = ?'; params.push(city); }
    if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }

    sql += ' ORDER BY name';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pharmacies WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Pharmacy not found' });

    const [inventory] = await pool.query(
      `SELECT pi.quantity, pi.unit_price, m.name, m.generic_name, m.strength, m.category
       FROM pharmacy_inventory pi JOIN medicines m ON pi.medicine_id = m.id
       WHERE pi.pharmacy_id = ? AND pi.quantity > 0 ORDER BY m.name`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...rows[0], inventory } });
  } catch (err) { next(err); }
});

module.exports = router;
