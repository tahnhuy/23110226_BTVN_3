const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const users = require('./data/users.json');

const SALT_ROUNDS = 10;

/**
 * Idempotent: creates users when missing (matched by email).
 */
const seedUsers = async () => {
    for (const row of users) {
        const { plainPassword, ...attrs } = row;
        const password = await bcrypt.hash(plainPassword, SALT_ROUNDS);

        const [user, created] = await User.findOrCreate({
            where: { email: attrs.email },
            defaults: {
                ...attrs,
                password
            }
        });

        if (created) {
            console.log(`  + seeded user: ${user.email}`);
        } else {
            console.log(`  · skipped (exists): ${user.email}`);
        }
    }
};

module.exports = { seedUsers };
