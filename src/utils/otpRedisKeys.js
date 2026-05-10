const { normalizeEmailForAuth } = require('./normalizeEmail');

const REGISTER_OTP_PREFIX = 'register:otp:';
const FORGOT_OTP_PREFIX = 'forgot:otp:';
const EDIT_PROFILE_OTP_PREFIX = 'edit_profile:otp:';

const otpKey = (prefix, email) => `${prefix}${String(email).toLowerCase()}`;

const otpKeysForEmailInput = (prefix, email) => {
    const raw = String(email || '').trim();
    const canonical = normalizeEmailForAuth(email);
    const legacyLower = raw.toLowerCase();
    return [...new Set([otpKey(prefix, canonical), otpKey(prefix, legacyLower)])];
};

module.exports = {
    otpKey,
    otpKeysForEmailInput,
    REGISTER_OTP_PREFIX,
    FORGOT_OTP_PREFIX,
    EDIT_PROFILE_OTP_PREFIX
};
