const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Promotion = sequelize.define(
    'Promotion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_shipping'),
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        minOrderAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        startsAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endsAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        usageLimit: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        usedCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: 'promotions',
        timestamps: true
    }
);

module.exports = Promotion;
