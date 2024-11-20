const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Nominee = sequelize.define('Nominee', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  additionalInfo: DataTypes.JSON,
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
});

module.exports = Nominee; 