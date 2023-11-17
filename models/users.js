const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const User = sequelize.define('Users', {
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
    email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
    },
    number: {
        allowNull: false,
        type: Sequelize.BIGINT,
        unique: true,
        validate: {
            len: [10, 10] // Ensure the phone number is exactly 10 digits
        }
    },
    password: {
        allowNull: false,
        type: Sequelize.STRING
    }
});

module.exports = User;