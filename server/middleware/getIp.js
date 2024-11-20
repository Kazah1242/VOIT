const getRealIp = (req, res, next) => {
    // Получаем реальный IP через заголовки прокси
    req.ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             req.connection.socket.remoteAddress;
             
    // Очищаем IPv6 префикс если есть
    req.ip = req.ip.split(',')[0].trim();
    if (req.ip.substr(0, 7) == "::ffff:") {
      req.ip = req.ip.substr(7);
    }
    
    next();
  };
  
  module.exports = getRealIp;