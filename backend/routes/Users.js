const User = require('../models/User');
const express = require('express');
const router = express.Router();
const { findUser, registerUser } = require('../controllers/user_controller');

// router.route('/').get((req, res) => {
//         res.render('login'); 
// }).post(findUser)

// router.route('/register').get(async (req, res) => {
//     res.render('signup');
// })
// .post(registerUser);




module.exports = router;