const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
    'Payment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        method: {
            type: DataTypes.ENUM('cod', 'bank_transfer', 'momo', 'vnpay'),
            allowNull: false,
            defaultValue: 'cod'
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        transactionRef: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'payments',
        timestamps: true
    }
);

module.exports = Payment;
