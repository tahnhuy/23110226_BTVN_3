// TODO: Cấu hình Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({});

module.exports = transporter;
