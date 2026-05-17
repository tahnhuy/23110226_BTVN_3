const { Category } = require('../models');
const categories = require('./data/categories.json');

const seedCategories = async () => {
    const slugToId = {};

    for (const parent of categories) {
        const { children, ...parentData } = parent;

        const [parentCat, parentCreated] = await Category.findOrCreate({
            where: { slug: parentData.slug },
            defaults: { ...parentData, parentId: null, isActive: true }
        });

        if (!parentCreated) {
            await parentCat.update({ ...parentData, parentId: null, isActive: true });
        }

        slugToId[parentData.slug] = parentCat.id;
        console.log(`  ${parentCreated ? '+' : '·'} category: ${parentData.slug}`);

        for (const child of children || []) {
            const [childCat, childCreated] = await Category.findOrCreate({
                where: { slug: child.slug },
                defaults: {
                    ...child,
                    parentId: parentCat.id,
                    description: null,
                    isActive: true
                }
            });

            if (!childCreated) {
                await childCat.update({
                    ...child,
                    parentId: parentCat.id,
                    isActive: true
                });
            }

            slugToId[child.slug] = childCat.id;
            console.log(`    ${childCreated ? '+' : '·'} subcategory: ${child.slug}`);
        }
    }

    return slugToId;
};

module.exports = { seedCategories };
