const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductMajor = sequelize.define(
    'ProductMajor',
    {
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        majorId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    },
    {
        tableName: 'product_majors',
        timestamps: false
    }
);

module.exports = ProductMajor;
