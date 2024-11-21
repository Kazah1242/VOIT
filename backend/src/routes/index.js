const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const voteRoutes = require('./vote.routes');

// Логирование всех запросов
router.use((req, res, next) => {
    console.log('API Request:', req.method, req.path);
    next();
});

router.use('/auth', authRoutes);
router.use('/votes', voteRoutes);

// Тестовый маршрут
router.get('/test', (req, res) => {
    res.json({ message: 'API работает!' });
});

module.exports = router; 