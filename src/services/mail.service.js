const sendEmail = require('../utils/sendEmail');
const { buildActivationOtpEmail } = require('../utils/emailTemplates/activationOtp');

/** Bật = chỉ in OTP ra console, không gửi SMTP (đặt OTP_DEV_CONSOLE=true trong .env). */
const devConsoleOtpEnabled = () => {
    if (process.env.OTP_DEV_CONSOLE !== 'true') return false;
    if (process.env.NODE_ENV === 'production') {
        console.warn(
            '[UTEShop] OTP_DEV_CONSOLE=true trong NODE_ENV=production — chỉ dùng khi bạn cố ý bỏ SMTP.'
        );
    }
    return true;
};

/**
 * @param {string} email
 * @param {string} otp
 * @param {number} [ttlSeconds=600] - must match Redis OTP TTL (for copy in email)
 */
const sendActivationOtp = async (email, otp, ttlSeconds = 600) => {
    const ttlMinutes = Math.max(1, Math.round(ttlSeconds / 60));

    if (devConsoleOtpEnabled()) {
        console.log(
            '\n[UTEShop][OTP] Không gửi SMTP — OTP_DEV_CONSOLE=true\n' +
                `  Email: ${email}\n` +
                `  OTP:   ${otp}\n` +
                `  TTL:   ~${ttlMinutes} phút (${ttlSeconds}s)\n`
        );
        return;
    }

    const { subject, text, html } = buildActivationOtpEmail(otp, ttlMinutes);

    await sendEmail({
        email,
        subject,
        message: text,
        html
    });
};

module.exports = { sendActivationOtp };
