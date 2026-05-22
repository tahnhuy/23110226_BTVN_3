const { DataTypes } = require('sequelize');

/**
 * Adds new columns without Sequelize alter (avoids duplicate index buildup on MySQL).
 */
const ensureUserColumns = async (sequelize) => {
    const qi = sequelize.getQueryInterface();
    let table;

    try {
        table = await qi.describeTable('users');
    } catch {
        return;
    }

    const addIfMissing = async (name, spec) => {
        if (!table[name]) {
            await qi.addColumn('users', name, spec);
            console.log(`  + users.${name}`);
        }
    };

    await addIfMissing('majorId', { type: DataTypes.INTEGER, allowNull: true });
    await addIfMissing('studentId', { type: DataTypes.STRING(20), allowNull: true });
    await addIfMissing('avatarUrl', { type: DataTypes.STRING(500), allowNull: true });
    await addIfMissing('emailVerifiedAt', { type: DataTypes.DATE, allowNull: true });
};

const ensureCartItemColumns = async (sequelize) => {
    const qi = sequelize.getQueryInterface();
    let table;

    try {
        table = await qi.describeTable('cart_items');
    } catch {
        return;
    }

    if (!table.isSelected) {
        await qi.addColumn('cart_items', 'isSelected', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });
        console.log('  + cart_items.isSelected');
    }
};

const ensureOrderColumns = async (sequelize) => {
    const qi = sequelize.getQueryInterface();
    let table;

    try {
        table = await qi.describeTable('orders');
    } catch {
        return;
    }

    const addIfMissing = async (name, spec) => {
        if (!table[name]) {
            await qi.addColumn('orders', name, spec);
            console.log(`  + orders.${name}`);
        }
    };

    await addIfMissing('confirmedAt', { type: DataTypes.DATE, allowNull: true });
    await addIfMissing('cancellationRequestedAt', { type: DataTypes.DATE, allowNull: true });
    await addIfMissing('customerCancelReason', { type: DataTypes.TEXT, allowNull: true });
};

module.exports = { ensureUserColumns, ensureCartItemColumns, ensureOrderColumns };
