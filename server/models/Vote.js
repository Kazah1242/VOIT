const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Vote = sequelize.define('Vote', {
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nomineeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['pollId', 'ipAddress']
    }
  ]
});

module.exports = Vote;