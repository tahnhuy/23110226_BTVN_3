const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        shortDescription: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        compareAtPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        costPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lowStockThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5
        },
        condition: {
            type: DataTypes.ENUM('new', 'like_new', 'used', 'refurbished'),
            allowNull: false,
            defaultValue: 'new'
        },
        productType: {
            type: DataTypes.ENUM('standard', 'consignment'),
            allowNull: false,
            defaultValue: 'standard'
        },
        status: {
            type: DataTypes.ENUM('draft', 'active', 'out_of_stock', 'archived'),
            allowNull: false,
            defaultValue: 'draft'
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        weightGrams: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true
        },
        attributes: {
            type: DataTypes.JSON,
            allowNull: true
        },
        viewCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        soldCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'products',
        timestamps: true,
        indexes: [
            { fields: ['categoryId', 'status'] },
            { fields: ['isFeatured', 'status'] }
        ]
    }
);

module.exports = Product;
