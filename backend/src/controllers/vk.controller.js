const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');

const vkCallback = async (req, res) => {
  try {
    console.log('VK callback request:', {
      body: req.body,
      query: req.query,
      headers: req.headers
    });

    const { userId, sessionId } = req.body;
    
    if (!userId || !sessionId) {
      console.log('Missing VK auth data');
      return res.status(400).json({ message: 'Missing VK auth data' });
    }

    // Получение данных пользователя через VK API
    const userResponse = await axios.get('https://api.vk.com/method/users.get', {
      params: {
        user_ids: userId,
        fields: 'first_name,last_name',
        access_token: sessionId,
        v: '5.131'
      }
    });

    console.log('VK API Response:', userResponse.data);

    if (!userResponse.data.response || !userResponse.data.response.length) {
      console.error('Invalid VK API response:', userResponse.data);
      return res.status(500).json({ message: 'Invalid response from VK API' });
    }

    const vkUser = userResponse.data.response[0];

    // Создание или обновление пользователя
    const [user, created] = await User.findOrCreate({
      where: { vkId: userId.toString() },
      defaults: {
        name: `${vkUser.first_name} ${vkUser.last_name}`,
        isVerified: true
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('VK Callback Error:', error);
    res.status(500).json({ 
      message: 'Server error during VK authentication',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  vkCallback
}; 