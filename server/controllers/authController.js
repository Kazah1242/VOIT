const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const ipAddress = req.ip;

    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const existingIpUser = await User.findOne({ 
      where: { ipAddress } 
    });
    
    if (existingIpUser) {
      return res.status(400).json({ 
        message: 'Регистрация с этого IP-адреса уже выполнена' 
      });
    }

    const user = await User.create({
      email,
      password,
      username,
      ipAddress
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    await user.updateLastLogin();

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: req.user._id,
        username: req.user.username,
        vk: req.user.vk
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
