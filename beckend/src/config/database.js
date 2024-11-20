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
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

module.exports = { sequelize, initDatabase }; 