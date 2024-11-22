const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationCode } = require('../services/email.service');

const requestAuthCode = async (req, res) => {
    try {
        const { email, isRegistration } = req.body;
        console.log('Получен запрос на код для email:', email);

        if (!email) {
            return res.status(400).json({ message: 'Email обязателен' });
        }

        // Проверяем статус регистрации
        const isRegistered = await User.isRegistered(email);
        
        if (isRegistration && isRegistered) {
            return res.status(400).json({ 
                message: 'Пользователь уже зарегистрирован. Пожалуйста, войдите.',
                shouldLogin: true 
            });
        }
        
        if (!isRegistration && !isRegistered) {
            return res.status(400).json({ 
                message: 'Пользователь не зарегистрирован. Пожалуйста, зарегистрируйтесь.',
                shouldRegister: true 
            });
        }

        // Генерация кода
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

        try {
            // Поиск или создание пользователя
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: { isVerified: false }
            });

            // Обновление кода верификации
            await user.update({
                verificationCode,
                verificationCodeExpires
            });

            // Отправка кода
            const emailSent = await sendVerificationCode(email, verificationCode);
            if (!emailSent) {
                throw new Error('Ошибка отправки email');
            }

            res.json({ 
                message: `Код подтверждения отправлен на ${email}`,
                isNewUser: created
            });
        } catch (error) {
            console.error('Ошибка при обработке пользователя:', error);
            throw error;
        }
    } catch (error) {
        console.error('Ошибка в requestAuthCode:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        console.log('Проверка кода для email:', email);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (!user.verificationCode || 
            user.verificationCode !== code || 
            user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Неверный или просроченный код' });
        }

        // Очистка кода и верификация
        await user.update({
            verificationCode: null,
            verificationCodeExpires: null,
            isVerified: true
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Ошибка в verifyCode:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    requestAuthCode,
    verifyCode
}; 