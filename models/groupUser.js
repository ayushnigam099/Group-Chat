const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const GroupUser=sequelize.define('GroupUser',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    GroupId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
})

module.exports=GroupUser