const express = require('express');
const router = express.Router();
const { getBudget, addGoal, updateGoal, deleteGoal } = require('../controllers/budgetController');
const asyncWrapper = require('../middleware/async');
const authMiddleware = require('../middleware/authMiddleware');

// GET budget items
router.get('/', authMiddleware, asyncWrapper(getBudget));

// POST route for adding a budgeting goal
router.post('/goals', authMiddleware, asyncWrapper(addGoal));

// NEW: PUT route for updating a budgeting goal
router.put('/goals/:id', authMiddleware, asyncWrapper(updateGoal));

// NEW: DELETE route for removing a budgeting goal
router.delete('/goals/:id', authMiddleware, asyncWrapper(deleteGoal));

module.exports = router;
