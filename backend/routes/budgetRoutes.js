const express = require('express');
const router = express.Router();
const { getBudget } = require('../controllers/budgetController');
const asyncWrapper = require('../middleware/async');


// Get all budget items
router.get('/',  asyncWrapper(getBudget));

// Update budget


module.exports = router;