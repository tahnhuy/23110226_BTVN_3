const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define(
    'Cart',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sessionId: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'converted', 'abandoned'),
            allowNull: false,
            defaultValue: 'active'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'carts',
        timestamps: true
    }
);

module.exports = Cart;
