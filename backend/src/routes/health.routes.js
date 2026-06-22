const express = require('express');
const { testConnection } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';

  try {
    await testConnection();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'ok',
    service: 'Synapse Health AI API',
    version: '1.0.0',
    tagline: 'Connecting Intelligence to Better Healthcare',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
