const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, generic_name, category, dosage_form, strength, requires_prescription FROM medicines ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/check-interactions', authenticate, async (req, res, next) => {
  try {
    const { medicineIds, allergies = [] } = req.body;
    if (!medicineIds?.length) {
      return res.status(400).json({ success: false, message: 'Medicine IDs required' });
    }

    const warnings = [];

    if (medicineIds.length >= 2) {
      const placeholders = medicineIds.map(() => '?').join(',');
      const [interactions] = await pool.query(
        `SELECT di.*, ma.name AS med_a, mb.name AS med_b
         FROM drug_interactions di
         JOIN medicines ma ON di.medicine_a_id = ma.id
         JOIN medicines mb ON di.medicine_b_id = mb.id
         WHERE di.medicine_a_id IN (${placeholders}) AND di.medicine_b_id IN (${placeholders})`,
        [...medicineIds, ...medicineIds]
      );
      interactions.forEach((i) => {
        warnings.push({
          type: 'drug_interaction',
          severity: i.severity,
          message: `${i.med_a} + ${i.med_b}: ${i.description}`,
        });
      });
    }

    const [meds] = await pool.query(
      `SELECT name FROM medicines WHERE id IN (${medicineIds.map(() => '?').join(',')})`,
      medicineIds
    );

    allergies.forEach((allergy) => {
      meds.forEach((m) => {
        if (m.name.toLowerCase().includes(allergy.toLowerCase()) || allergy.toLowerCase().includes('penicillin') && m.name.toLowerCase().includes('amoxicillin')) {
          warnings.push({ type: 'allergy', severity: 'contraindicated', message: `Allergy alert: ${allergy} may conflict with ${m.name}` });
        }
      });
    });

    res.json({ success: true, data: { warnings, safe: warnings.filter((w) => w.severity === 'contraindicated' || w.severity === 'severe').length === 0 } });
  } catch (err) { next(err); }
});

module.exports = router;
