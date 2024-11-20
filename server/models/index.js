const sequelize = require('../config/sequelize');
const User = require('./User');
const Poll = require('./Poll');
const Category = require('./Category');
const Vote = require('./Vote');
const Nominee = require('./Nominee');

// Определяем ассоциации
Poll.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Poll.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Poll, { foreignKey: 'categoryId', as: 'polls' });
Nominee.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Nominee, { foreignKey: 'categoryId', as: 'nominees' });

module.exports = {
  sequelize,
  User,
  Poll,
  Category,
  Vote,
  Nominee
}; 