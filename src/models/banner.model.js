const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define(
    'Banner',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        linkUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        badgeText: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        placement: {
            type: DataTypes.ENUM('hero', 'promo_left', 'promo_right'),
            allowNull: false,
            defaultValue: 'promo_left'
        },
        startsAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endsAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: 'banners',
        timestamps: true
    }
);

module.exports = Banner;
