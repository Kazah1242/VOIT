const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Тестовый маршрут
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes работают' });
});

// Маршруты аутентификации
router.post('/request-code', authController.requestAuthCode);
router.post('/verify-code', authController.verifyCode);

module.exports = router; 