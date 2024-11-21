const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { vkCallback } = require('../controllers/vk.controller');

// Существующие маршруты
router.post('/request-code', authController.requestAuthCode);
router.post('/verify-code', authController.verifyCode);

// VK колбэк - поддержка обоих методов
router.post('/vk-callback', vkCallback);
router.get('/vk-callback', vkCallback);

module.exports = router; 