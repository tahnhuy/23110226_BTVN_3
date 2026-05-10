const { normalizeEmailForAuth } = require('./normalizeEmail');

const REGISTER_OTP_PREFIX = 'register:otp:';

const otpKey = (email) => `${REGISTER_OTP_PREFIX}${String(email).toLowerCase()}`;

/** Hai biến thể email (Gmail chuẩn vs bản gõ thường) → cùng một OTP được ghi cả hai key */
const otpKeysForEmailInput = (email) => {
    const raw = String(email || '').trim();
    const canonical = normalizeEmailForAuth(email);
    const legacyLower = raw.toLowerCase();
    return [...new Set([otpKey(canonical), otpKey(legacyLower)])];
};

module.exports = {
    otpKey,
    otpKeysForEmailInput,
    REGISTER_OTP_PREFIX
};
