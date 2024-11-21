const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserVote = sequelize.define('UserVote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  voteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  selectedOption: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = UserVote; 