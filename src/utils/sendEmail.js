const transporter = require('../config/mailer');

/**
 * @param {object} options
 * @param {string} options.email - recipient
 * @param {string} options.subject
 * @param {string} options.message - plain text body (fallback + alt for HTML clients)
 * @param {string} [options.html] - optional HTML body
 */
const sendEmail = async (options) => {
    const fromName = process.env.MAIL_FROM_NAME || 'UTEShop';
    const fromAddress = process.env.MAIL_USER;

    if (!fromAddress || !process.env.MAIL_PASS) {
        const err = new Error(
            'Thiếu MAIL_USER hoặc MAIL_PASS trong .env (hoặc bật OTP_DEV_CONSOLE=true để không cần SMTP khi dev).'
        );
        err.code = 'MAIL_ENV_MISSING';
        throw err;
    }

    const mailOptions = {
        from: `${fromName} <${fromAddress}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    if (options.html) {
        mailOptions.html = options.html;
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
