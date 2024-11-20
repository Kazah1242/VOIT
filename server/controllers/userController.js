const User = require('../models/User');

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin;
    }

    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Ошибка при обновлении пользователя:', err);
    res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
  }
}; 