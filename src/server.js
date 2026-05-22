const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const requiredDbEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);
if (missingDbEnv.length > 0) {
    console.error(
        `❌ Thiếu biến môi trường trong .env: ${missingDbEnv.join(', ')}\n` +
            '   Sao chép .env.example → .env và điền DB_USER, DB_PASSWORD, ...'
    );
    process.exit(1);
}

const app = require('./app');

// Import config
const sequelize = require('./config/db');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Kết nối Database MySQL
        await sequelize.authenticate();
        console.log('✅ MySQL (Docker) connected successfully.');

        const { syncDatabase } = require('./models');
        const { ensureUserColumns, ensureCartItemColumns, ensureOrderColumns } =
            require('./utils/ensureSchema');
        await syncDatabase({ alter: false });
        await ensureUserColumns(sequelize);
        await ensureCartItemColumns(sequelize);
        await ensureOrderColumns(sequelize);
        console.log('✅ MySQL tables synchronized.');

        const { runAutoConfirmPendingOrders } = require('./services/order.service');
        runAutoConfirmPendingOrders().catch((err) =>
            console.error('Auto-confirm orders error:', err.message)
        );
        setInterval(
            () => {
                runAutoConfirmPendingOrders().catch((err) =>
                    console.error('Auto-confirm orders error:', err.message)
                );
            },
            60 * 1000
        );

        // 2. Kết nối Redis
        await redisClient.connect();
        console.log('✅ Redis (Docker) connected successfully.');

        // 3. Khởi động Server Express
        app.listen(PORT, () => {
            console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to services:', error);
        process.exit(1);
    }
};

startServer();
