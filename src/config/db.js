const path = require('path');
const { Sequelize } = require('sequelize');

// Luôn load .env từ thư mục gốc project (tránh cwd khác khiến DB_USER rỗng)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;
