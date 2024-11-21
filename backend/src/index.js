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
    origin: [
        'http://localhost:5173',
        'https://gamely-glad-groundhog.cloudpub.ru'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

app.use(express.json());

app.use((req, res, next) => {
    if (req.path.includes('/api/auth/vk-callback')) {
        console.log('VK Callback Headers:', req.headers);
        console.log('VK Callback Body:', req.body);
        console.log('VK Callback Query:', req.query);
    }
    next();
});

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

// Добавьте логирование ошибок
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`API доступно по адресу: http://localhost:${port}/api`);
}); 