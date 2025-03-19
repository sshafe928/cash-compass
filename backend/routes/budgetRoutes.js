const express = require('express');
const router = express.Router();
const { getBudget, updateBudget } = require('../controllers/budgetController');
const asyncWrapper = require('../middleware/async');


// Get all budget items
router.get('/',  asyncWrapper(getBudget));

// Update budget
router.post('/update', updateBudget);


module.exports = router;