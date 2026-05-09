require('dotenv').config();
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

        // Optional: Tự động tạo bảng User nếu chưa có (Có thể bật lên để test)
        // const User = require('./models/user.model');
        // await sequelize.sync({ alter: true });
        // console.log('✅ MySQL Tables synchronized.');

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
