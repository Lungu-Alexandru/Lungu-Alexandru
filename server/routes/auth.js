const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Înregistrare
router.post('/register', authController.registerValidation, authController.register);

// Autentificare
router.post('/login', authController.loginValidation, authController.login);

module.exports = router;