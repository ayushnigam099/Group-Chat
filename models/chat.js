const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Chat = sequelize.define('Chat', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    date_time: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
},
    {
        timestamps: false
    });
  
  module.exports = Chat;