const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Group=sequelize.define('chatgroup',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING
    },

})

module.exports=Group