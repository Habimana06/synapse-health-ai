const express = require('express');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { getPharmacistProfileId } = require('../utils/helpers');

const router = express.Router();

router.use(authenticate, authorize('pharmacist'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const profile = await getPharmacistProfileId(req.user.id);
    const pharmacyId = profile?.pharmacy_id;
    let inventory = 0;
    let lowStock = 0;
    if (pharmacyId) {
      const [[inv], [low]] = await Promise.all([
        pool.query('SELECT COUNT(*) AS c FROM pharmacy_inventory WHERE pharmacy_id=?', [pharmacyId]),
        pool.query('SELECT COUNT(*) AS c FROM pharmacy_inventory WHERE pharmacy_id=? AND quantity < 50', [pharmacyId]),
      ]);
      inventory = inv[0].c;
      lowStock = low[0].c;
    }
    const [[pending]] = await pool.query('SELECT COUNT(*) AS c FROM prescriptions WHERE status IN ("approved","pending")');
    res.json({ success: true, data: { inventoryItems: inventory, lowStock, pendingPrescriptions: pending.c } });
  } catch (err) { next(err); }
});

router.get('/inventory', async (req, res, next) => {
  try {
    const profile = await getPharmacistProfileId(req.user.id);
    const [rows] = await pool.query(
      `SELECT pi.*, m.name, m.generic_name, m.category, m.strength
       FROM pharmacy_inventory pi JOIN medicines m ON pi.medicine_id = m.id
       WHERE pi.pharmacy_id = ? ORDER BY m.name`,
      [profile.pharmacy_id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.put('/inventory/:id', async (req, res, next) => {
  try {
    const { quantity, unitPrice } = req.body;
    await pool.query(
      'UPDATE pharmacy_inventory SET quantity=?, unit_price=?, last_updated_by=? WHERE id=?',
      [quantity, unitPrice, req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Inventory updated' });
  } catch (err) { next(err); }
});

router.post('/inventory', async (req, res, next) => {
  try {
    const profile = await getPharmacistProfileId(req.user.id);
    const { medicineId, quantity, unitPrice } = req.body;
    await pool.query(
      `INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, quantity, unit_price, last_updated_by)
       VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), unit_price=VALUES(unit_price), last_updated_by=VALUES(last_updated_by)`,
      [profile.pharmacy_id, medicineId, quantity, unitPrice, req.user.id]
    );
    res.status(201).json({ success: true, message: 'Inventory item added/updated' });
  } catch (err) { next(err); }
});

router.get('/prescriptions', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, du.first_name AS doctor_first, du.last_name AS doctor_last
       FROM prescriptions p
       JOIN patient_profiles pp ON p.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       JOIN doctor_profiles dp ON p.doctor_id = dp.id
       JOIN users du ON dp.user_id = du.id
       WHERE p.status IN ('approved','pending') ORDER BY p.prescribed_at DESC`
    );
    for (const rx of rows) {
      const [items] = await pool.query(
        `SELECT pi.*, m.name AS medicine_name FROM prescription_items pi
         JOIN medicines m ON pi.medicine_id = m.id WHERE pi.prescription_id = ?`, [rx.id]
      );
      rx.items = items;
    }
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.patch('/prescriptions/:id/dispense', async (req, res, next) => {
  try {
    await pool.query('UPDATE prescriptions SET status = "dispensed" WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Prescription marked as dispensed' });
  } catch (err) { next(err); }
});

router.get('/medicines', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, generic_name, category, strength FROM medicines ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

module.exports = router;
