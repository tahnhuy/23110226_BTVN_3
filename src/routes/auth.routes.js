const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');
const {
    authRegisterLimiter,
    authLoginLimiter,
    authVerifyLimiter,
    authResendLimiter,
    authRefreshLimiter
} = require('../middlewares/rateLimit.middleware');
const {
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    resendOtpValidation,
    refreshTokenValidation
} = require('../validators/auth.validator');

const router = express.Router();

router.post(
    '/register',
    authRegisterLimiter,
    registerValidation,
    validate,
    authController.register
);

router.post(
    '/verify-email',
    authVerifyLimiter,
    verifyEmailValidation,
    validate,
    authController.verifyEmail
);

router.post(
    '/resend-otp',
    authResendLimiter,
    resendOtpValidation,
    validate,
    authController.resendOtp
);

router.post('/login', authLoginLimiter, loginValidation, validate, authController.login);

router.post(
    '/refresh',
    authRefreshLimiter,
    refreshTokenValidation,
    validate,
    authController.refresh
);

module.exports = router;
