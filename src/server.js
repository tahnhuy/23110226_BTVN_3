require('dotenv').config();
const app = require('./app');

// Import config (Để sau này bạn thiết lập kết nối DB/Redis)
// const { sequelize } = require('./config/db');
// const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // TODO: Kết nối Database
        // await sequelize.authenticate();
        // console.log('MySQL connected successfully.');

        // TODO: Kết nối Redis
        // await redisClient.connect();
        // console.log('Redis connected successfully.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
