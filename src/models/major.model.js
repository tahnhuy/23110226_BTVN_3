const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Major = sequelize.define(
    'Major',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        sortOrder: {
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
        tableName: 'majors',
        timestamps: true
    }
);

module.exports = Major;
