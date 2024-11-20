const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const routes = require('./routes');

// Проверка наличия JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error('ОШИБКА: JWT_SECRET не установлен в .env файле');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// Инициализация базы данных
initDatabase();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Логгирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Роуты
app.use('/api', routes);

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(500).json({ 
        message: 'Ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log('JWT_SECRET установлен:', !!process.env.JWT_SECRET);
});

console.log('Загруженные переменные окружения:', {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV
}); 