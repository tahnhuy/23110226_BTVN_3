const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductReview = sequelize.define(
    'ProductReview',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        rating: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: { min: 1, max: 5 }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        }
    },
    {
        tableName: 'product_reviews',
        timestamps: true,
        indexes: [{ fields: ['productId', 'userId'] }]
    }
);

module.exports = ProductReview;
