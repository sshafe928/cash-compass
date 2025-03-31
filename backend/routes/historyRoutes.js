const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your auth middleware


router.get('/', authMiddleware, getHistory);

module.exports = router;