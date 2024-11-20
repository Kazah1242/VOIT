const { check } = require('express-validator');

exports.validateRegistration = [
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
  check('username', 'Введите имя пользователя').not().isEmpty()
];

exports.validateLogin = [
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Введите пароль').exists()
];

exports.validatePollCreation = [
  check('title', 'Введите название голосования').not().isEmpty(),
  check('category', 'Выберите категорию').not().isEmpty(),
  check('nominees', 'Добавьте минимум двух номинантов').isArray({ min: 2 }),
  check('nominees.*.name', 'У каждого номинанта должно быть имя').not().isEmpty(),
  check('endDate', 'Укажите дату окончания голосования').isISO8601()
]; 