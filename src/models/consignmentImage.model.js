const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConsignmentImage = sequelize.define(
    'ConsignmentImage',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        consignmentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    },
    {
        tableName: 'consignment_images',
        timestamps: true
    }
);

module.exports = ConsignmentImage;
