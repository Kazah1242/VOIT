const express = require('express');
const router = express.Router();
const { requestAuthCode, verifyCode } = require('../controllers/auth.controller');

router.post('/request-code', requestAuthCode);
router.post('/verify-code', verifyCode);

module.exports = router; 