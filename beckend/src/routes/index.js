const express = require('express');
const router = express.Router();

// Импорт роутов
const authRoutes = require('./auth.routes');
const voteRoutes = require('./vote.routes');

// Использование роутов
router.use('/auth', authRoutes);
router.use('/votes', voteRoutes);

// Тестовый роут
router.get('/test', (req, res) => {
    res.json({ message: 'API работает!' });
});

module.exports = router; 