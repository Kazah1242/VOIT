const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.patch('/me', auth, userController.updateMe);

module.exports = router; 