const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user_controller');
const asyncWrapper = require('../middleware/async');

router.post('/register', asyncWrapper(registerUser));
router.post('/login', asyncWrapper(loginUser));


// router.post('/delete-user/:id', authMiddleware, asyncWrapper(deleteUser));

module.exports = router;

