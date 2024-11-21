const express = require('express');
const router = express.Router();

// Получить все голосования
router.get('/', (req, res) => {
    res.json({ message: 'Список голосований' });
});

// Создать голосование
router.post('/', (req, res) => {
    res.json({ message: 'Создание голосования' });
});

// Получить конкретное голосование
router.get('/:id', (req, res) => {
    res.json({ message: `Голосование ${req.params.id}` });
});

module.exports = router; 