const express = require('express');
const router = express.Router();
const { getForms } = require('../controllers/formsController');

router.get('/', getForms);

module.exports = router;