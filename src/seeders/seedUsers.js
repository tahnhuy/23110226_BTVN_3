const bcrypt = require('bcryptjs');
const { User, Major } = require('../models');
const users = require('./data/users.json');

const SALT_ROUNDS = 10;

/**
 * Idempotent: creates users when missing (matched by email).
 */
const seedUsers = async () => {
    await User.update({ role: 'customer' }, { where: { role: 'user' } });

    for (const row of users) {
        const { plainPassword, majorCode, ...attrs } = row;
        const password = await bcrypt.hash(plainPassword, SALT_ROUNDS);

        let majorId = null;
        if (majorCode) {
            const major = await Major.findOne({ where: { code: majorCode } });
            majorId = major?.id ?? null;
        }

        const [user, created] = await User.findOrCreate({
            where: { email: attrs.email },
            defaults: {
                ...attrs,
                majorId,
                password
            }
        });

        if (!created) {
            await user.update({ ...attrs, majorId });
        }

        console.log(`  ${created ? '+' : '·'} user: ${user.email}`);
    }
};

module.exports = { seedUsers };
