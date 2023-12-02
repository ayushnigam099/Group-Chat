const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const ArchivedChat =sequelize.define('archivedchats',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    chat: {
        allowNull: false,
        type: Sequelize.STRING
    },
})

module.exports=ArchivedChat