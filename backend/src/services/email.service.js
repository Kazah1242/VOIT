const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'ДРУЖИЩЕ твой голос нужен нам',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
        <img src="https://s.iimg.su/s/21/HeP4WMgVUJnAKnPQAUt42X6bE1cKtgoc9ts0pvqz.jpg" 
             alt="Логотип" 
             style="width: 800px; /* увеличили размер */
                    margin-bottom: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #333;">вот твой код подтверждения</h1>
        <p style="font-size: 16px;">Ваш код для входа в систему: <strong style="font-size: 24px; color: #4CAF50;">${code}</strong></p>
        <p style="color: #666;">Код действителен в течение 10 минут</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationCode
}; 