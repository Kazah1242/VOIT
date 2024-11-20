const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Все маршруты защищены middleware auth и isAdmin
router.use(auth, isAdmin);

// Категории
router.post('/categories', adminController.addCategory);
router.get('/categories', adminController.getCategories);

// Номинанты
router.post('/nominees', adminController.addNominee);
router.get('/categories/:categoryId/nominees', adminController.getNomineesByCategory);

module.exports = router; 