const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure you have this

router.get('/', authMiddleware, getDashboard);

module.exports = router;
