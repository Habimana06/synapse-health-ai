const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/health', healthRoutes);

// Future route modules (Step 2+):
// router.use('/auth', require('./auth.routes'));
// router.use('/patients', require('./patient.routes'));
// router.use('/doctors', require('./doctor.routes'));
// router.use('/pharmacies', require('./pharmacy.routes'));
// router.use('/ai', require('./ai.routes'));

module.exports = router;
