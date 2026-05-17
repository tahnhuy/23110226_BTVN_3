const { Major } = require('../models');
const majors = require('./data/majors.json');

const seedMajors = async () => {
    const codeToId = {};

    for (const row of majors) {
        const [major, created] = await Major.findOrCreate({
            where: { code: row.code },
            defaults: row
        });

        if (!created) {
            await major.update({
                name: row.name,
                sortOrder: row.sortOrder,
                isActive: true
            });
        }

        codeToId[row.code] = major.id;
        console.log(`  ${created ? '+' : '·'} major: ${row.code}`);
    }

    return codeToId;
};

module.exports = { seedMajors };
