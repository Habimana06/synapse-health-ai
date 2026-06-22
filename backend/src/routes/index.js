const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const doctorRoutes = require('./doctor.routes');
const pharmacistRoutes = require('./pharmacist.routes');
const adminRoutes = require('./admin.routes');
const pharmacyRoutes = require('./pharmacy.routes');
const medicineRoutes = require('./medicine.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/pharmacists', pharmacistRoutes);
router.use('/admin', adminRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/medicines', medicineRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
