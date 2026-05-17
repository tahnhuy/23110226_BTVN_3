const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define(
    'Address',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recipientName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        line1: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        line2: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ward: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        district: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        label: {
            type: DataTypes.STRING(50),
            allowNull: true
        }
    },
    {
        tableName: 'addresses',
        timestamps: true
    }
);

module.exports = Address;
