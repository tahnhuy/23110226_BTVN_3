const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define(
    'Wishlist',
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    },
    {
        tableName: 'wishlists',
        timestamps: true,
        updatedAt: false
    }
);

module.exports = Wishlist;
