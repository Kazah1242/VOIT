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
    subject: 'Код подтверждения для голосования',
    html: `
      <h1>Код подтверждения</h1>
      <p>Ваш код для входа в систему: <strong>${code}</strong></p>
      <p>Код действителен в течение 10 минут</p>
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