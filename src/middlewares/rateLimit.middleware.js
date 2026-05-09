// TODO: Viết cấu hình rate limiter
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    // Cấu hình
});

module.exports = { globalLimiter };
