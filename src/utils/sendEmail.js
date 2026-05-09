const transporter = require('../config/mailer');

const sendEmail = async (options) => {
    const mailOptions = {
        from: `UTEShop <${process.env.MAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.htmlMessage // Nếu dùng HTML
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
