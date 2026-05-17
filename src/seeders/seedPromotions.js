const { Promotion } = require('../models');
const promotions = require('./data/promotions.json');

const seedPromotions = async (categorySlugToId) => {
    for (const row of promotions) {
        const { categorySlug, ...data } = row;
        const categoryId = categorySlug ? categorySlugToId[categorySlug] : null;

        const [promo, created] = await Promotion.findOrCreate({
            where: { code: data.code },
            defaults: { ...data, categoryId }
        });

        if (!created) {
            await promo.update({ ...data, categoryId });
        }

        console.log(`  ${created ? '+' : '·'} promotion: ${data.code}`);
    }
};

module.exports = { seedPromotions };
