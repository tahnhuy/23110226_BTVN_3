const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING(100),
            allowNull: true
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
        tableName: 'categories',
        timestamps: true
    }
);

module.exports = Category;
