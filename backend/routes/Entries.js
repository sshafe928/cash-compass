const express = require('express');
const router = express.Router();
const Saving = require('../models/Savings_entry');
const Debt = require('../models/Debt_entry');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const isAuth = require('../middleware/isAuth');


// const { } = require('../controllers/Entry_controller');




router.route('/edit/:id')

router.route('/delete/:id').post(isAuth, deleteTrans);





module.exports = router;