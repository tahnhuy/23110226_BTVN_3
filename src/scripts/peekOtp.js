/**
 * Đọc OTP đăng ký còn trong Redis (debug / local).
 * Usage: npm run otp:peek -- you@example.com
 */
require('dotenv').config();
const redisClient = require('../config/redis');
const { otpKeysForEmailInput } = require('../utils/otpRedisKeys');

const email = process.argv[2];
if (!email) {
    console.error('Usage: npm run otp:peek -- <email>');
    process.exit(1);
}

const run = async () => {
    try {
        await redisClient.connect();
        const keys = otpKeysForEmailInput(email);
        let found = false;
        for (const key of keys) {
            const otp = await redisClient.get(key);
            if (otp) {
                console.log(`OTP cho ${email}: ${otp}`);
                console.log(`Redis key: ${key}`);
                found = true;
            }
        }
        if (!found) {
            console.log(`Không có OTP cho các key: ${keys.join(', ')}`);
            console.log('(Hết hạn TTL, sai email, hoặc chưa đăng ký.)');
        }
    } catch (e) {
        console.error(e.message || e);
        process.exitCode = 1;
    } finally {
        await redisClient.quit().catch(() => {});
    }
};

run();
