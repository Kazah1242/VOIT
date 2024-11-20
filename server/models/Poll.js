const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Poll = sequelize.define('Poll', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: DataTypes.TEXT,
  nominees: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Poll;