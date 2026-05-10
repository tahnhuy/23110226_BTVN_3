require('dotenv').config();

const sequelize = require('../config/db');
const User = require('../models/user.model');
const { seedUsers } = require('./seedUsers');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection OK.');

        await User.sync();
        console.log('Ensured `users` table exists.');

        console.log('Seeding users...');
        await seedUsers();

        console.log('Done.');
    } catch (err) {
        console.error('Seed failed:', err);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

run();
