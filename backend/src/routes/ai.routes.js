const express = require('express');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { getPatientProfileId } = require('../utils/helpers');
const { analyzeSymptoms, recommendDrugs, assessHealthRisk, chatResponse } = require('../services/ai.service');

const router = express.Router();

router.post('/symptoms', authenticate, async (req, res, next) => {
  try {
    const { symptoms, age, gender, existingConditions } = req.body;
    const result = await analyzeSymptoms({ symptoms, age, gender, existingConditions });
    const patientId = req.user.role === 'patient' ? await getPatientProfileId(req.user.id) : null;

    await pool.query(
      'INSERT INTO symptom_assessments (patient_id, user_id, symptoms, age, gender, existing_conditions, ai_suggestions) VALUES (?,?,?,?,?,?,?)',
      [patientId, req.user.id, JSON.stringify(symptoms), age, gender, existingConditions, JSON.stringify(result)]
    );
    await pool.query(
      'INSERT INTO analytics_events (event_type, event_data, user_id, region) VALUES (?,?,?,?)',
      ['symptom_check', JSON.stringify({ symptoms }), req.user.id, 'Kigali']
    );

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/drug-recommendation', authenticate, async (req, res, next) => {
  try {
    const { diagnosis, age, medicalHistory, currentMedications, medicineIds, allergies = [] } = req.body;
    const result = await recommendDrugs({ diagnosis, age, medicalHistory, currentMedications });

    if (medicineIds?.length) {
      const warnings = [];
      if (medicineIds.length >= 2) {
        const placeholders = medicineIds.map(() => '?').join(',');
        const [interactions] = await pool.query(
          `SELECT di.*, ma.name AS med_a, mb.name AS med_b FROM drug_interactions di
           JOIN medicines ma ON di.medicine_a_id = ma.id JOIN medicines mb ON di.medicine_b_id = mb.id
           WHERE di.medicine_a_id IN (${placeholders}) AND di.medicine_b_id IN (${placeholders})`,
          [...medicineIds, ...medicineIds]
        );
        interactions.forEach((i) => warnings.push({ type: 'drug_interaction', severity: i.severity, message: `${i.med_a} + ${i.med_b}: ${i.description}` }));
      }
      result.interactionWarnings = warnings;
      result.safe = !warnings.some((w) => w.severity === 'contraindicated' || w.severity === 'severe');
    }

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/health-risk', authenticate, async (req, res, next) => {
  try {
    const { riskType, age, gender, bmi, conditions } = req.body;
    const result = assessHealthRisk({ riskType, age, gender, bmi, conditions });
    const patientId = req.user.role === 'patient' ? await getPatientProfileId(req.user.id) : req.body.patientId;

    if (patientId) {
      await pool.query(
        'INSERT INTO health_risk_assessments (patient_id, risk_type, risk_score, risk_level, factors, recommendations) VALUES (?,?,?,?,?,?)',
        [patientId, riskType, result.riskScore, result.riskLevel, JSON.stringify({ age, gender, bmi, conditions }), result.recommendations]
      );
    }

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { message, language = 'en', sessionId } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    const sid = sessionId || crypto.randomBytes(16).toString('hex');
    const reply = await chatResponse(message, language);

    await pool.query('INSERT INTO chat_messages (user_id, role, content, language, session_id) VALUES (?,?,?,?,?)', [req.user.id, 'user', message, language, sid]);
    await pool.query('INSERT INTO chat_messages (user_id, role, content, language, session_id) VALUES (?,?,?,?,?)', [req.user.id, 'assistant', reply, language, sid]);

    res.json({ success: true, data: { reply, sessionId: sid } });
  } catch (err) { next(err); }
});

router.get('/chat/history', authenticate, async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    let sql = 'SELECT * FROM chat_messages WHERE user_id = ?';
    const params = [req.user.id];
    if (sessionId) { sql += ' AND session_id = ?'; params.push(sessionId); }
    sql += ' ORDER BY created_at ASC LIMIT 100';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

module.exports = router;
