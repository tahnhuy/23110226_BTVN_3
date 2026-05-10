const validator = require('validator');

/**
 * Khớp chuẩn hóa email với express-validator `.normalizeEmail()` (Gmail bỏ dấu chấm local-part, v.v.).
 * Dùng chung cho Redis key `register:otp:*` và trường email trong DB.
 */
const normalizeEmailForAuth = (email) => {
    const trimmed = String(email || '').trim();
    if (!trimmed) return '';
    const out = validator.normalizeEmail(trimmed);
    return out || trimmed.toLowerCase();
};

module.exports = { normalizeEmailForAuth };
