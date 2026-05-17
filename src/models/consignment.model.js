const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consignment = sequelize.define(
    'Consignment',
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
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        suggestedPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        approvedPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        condition: {
            type: DataTypes.ENUM('new', 'like_new', 'used', 'refurbished'),
            allowNull: false,
            defaultValue: 'used'
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'listed', 'sold', 'returned'),
            allowNull: false,
            defaultValue: 'pending'
        },
        adminNote: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        contactPhone: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },
    {
        tableName: 'consignments',
        timestamps: true
    }
);

module.exports = Consignment;
