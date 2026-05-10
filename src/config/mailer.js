const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Gmail hiển thị App Password có khoảng trắng — SMTP cần 16 ký tự liền.
 */
const normalizeMailPass = (pass) => (pass ? String(pass).replace(/\s/g, '') : '');

/**
 * - gmail: dùng `service: 'gmail'` của Nodemailer (ổn định nhất cho Gmail / Google Workspace có App Password).
 * - smtp: dùng MAIL_HOST + MAIL_PORT (Outlook, SendGrid, Mailtrap...).
 */
const buildTransportOptions = () => {
    const user = process.env.MAIL_USER?.trim();
    const pass = normalizeMailPass(process.env.MAIL_PASS);
    const mode = (process.env.MAIL_TRANSPORT || 'gmail').toLowerCase();

    if (mode === 'gmail') {
        return {
            service: 'gmail',
            auth: {
                user,
                pass
            }
        };
    }

    return {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT) || 587,
        secure: Number(process.env.MAIL_PORT) === 465,
        auth: {
            user,
            pass
        },
        tls: {
            rejectUnauthorized: true
        }
    };
};

const transporter = nodemailer.createTransport(buildTransportOptions());

module.exports = transporter;
