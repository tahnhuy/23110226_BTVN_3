const { Banner } = require('../models');
const banners = require('./data/banners.json');

const seedBanners = async () => {
    for (const row of banners) {
        const [banner, created] = await Banner.findOrCreate({
            where: { title: row.title, placement: row.placement },
            defaults: row
        });

        if (!created) {
            await banner.update(row);
        }

        console.log(`  ${created ? '+' : '·'} banner: ${row.placement}`);
    }
};

module.exports = { seedBanners };
