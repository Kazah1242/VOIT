const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Ошибка аутентификации:', err);
    res.status(401).json({ message: 'Пожалуйста, авторизуйтесь' });
  }
}; 