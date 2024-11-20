const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Доступ запрещен. Требуются права администратора' 
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Ошибка проверки прав доступа' });
  }
};

module.exports = isAdmin; 