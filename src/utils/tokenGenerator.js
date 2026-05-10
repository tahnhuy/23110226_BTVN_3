const jwt = require('jsonwebtoken');

const accessSecret = () => process.env.JWT_ACCESS_SECRET;
const refreshSecret = () => process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (payload) => {
    return jwt.sign(payload, accessSecret(), {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, refreshSecret(), {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d'
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
