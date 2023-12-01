const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const upload=sequelize.define('upload',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    link: {
        allowNull: false,
        type: Sequelize.STRING
    },
})

module.exports=upload