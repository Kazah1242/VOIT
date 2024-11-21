const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к SQLite успешно установлено');
    
    // Изменяем force на true только один раз, чтобы пересоздать таблицы
    await sequelize.sync({ force: true }); // !!! После первого запуска измените на { alter: true }
    console.log('Модели синхронизированы с базой данных');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error.message);
    throw new Error(`Ошибка инициализации базы данных: ${error.message}`);
  }
};

module.exports = { sequelize, initDatabase }; 