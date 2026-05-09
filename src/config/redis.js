// TODO: Cấu hình kết nối Redis
const { createClient } = require('redis');

const redisClient = createClient();

module.exports = redisClient;
