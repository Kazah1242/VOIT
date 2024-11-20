const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const routes = require('./routes');

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

// Логирование всех запросов
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.path);
    next();
});

// Подключение маршрутов API
app.use('/api', routes);

// Корневой маршрут
app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает' });
});

// Обработка 404
app.use((req, res) => {
    console.log('404 для пути:', req.path);
    res.status(404).json({ 
        message: 'Маршрут не найден',
        path: req.path,
        method: req.method
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`API доступно по адресу: http://localhost:${port}/api`);
}); 