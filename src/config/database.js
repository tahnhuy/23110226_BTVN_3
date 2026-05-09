// Sequelize / Prisma / Mongoose Configuration
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'uteshop_db',
    process.env.DB_USER || 'uteshop_user',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // Set true để xem SQL query trong console
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
