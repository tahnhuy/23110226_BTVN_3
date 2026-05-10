const { body } = require('express-validator');

const registerValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username là bắt buộc')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username từ 3 đến 50 ký tự'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Mật khẩu là bắt buộc')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu ít nhất 8 ký tự')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage('Mật khẩu phải có ít nhất một chữ cái và một chữ số')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc')
];

const verifyEmailValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('otp')
        .trim()
        .customSanitizer((v) =>
            String(v ?? '')
                .normalize('NFKC')
                .replace(/\D/g, '')
        )
        .notEmpty()
        .withMessage('OTP là bắt buộc')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP phải có đúng 6 chữ số')
        .matches(/^\d{6}$/)
        .withMessage('OTP chỉ gồm chữ số')
];

const resendOtpValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email là bắt buộc')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail()
];

const refreshTokenValidation = [
    body('refreshToken').notEmpty().withMessage('refreshToken là bắt buộc')
];

module.exports = {
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    resendOtpValidation,
    refreshTokenValidation
};
