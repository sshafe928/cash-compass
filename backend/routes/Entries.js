const express = require('express');
const router = express.Router();
const Saving = require('../models/Savings');
const Debt = require('../models/debtItems');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Goals = require('../models/savingsItems');
const Budgets = require('../models/budgetItems');
const isAuth = require('../middleware/isAuth');


// const { } = require('../controllers/Entry_controller');




router.route('/edit/:id')

router.route('/delete/:id').post(isAuth, deleteTrans);





module.exports = router;