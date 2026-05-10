const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responseHandler');

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        return successResponse(res, 201, result.message, {
            userId: result.userId,
            email: result.email
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyActivation(req.body);
        return successResponse(res, 200, result.message, {});
    } catch (error) {
        next(error);
    }
};

const resendOtp = async (req, res, next) => {
    try {
        const result = await authService.resendActivationOtp(req.body);
        return successResponse(res, 200, result.message, {});
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return successResponse(res, 200, 'Đăng nhập thành công', result);
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshSession(refreshToken);
        return successResponse(res, 200, 'Token đã được làm mới', result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyEmail,
    resendOtp,
    login,
    refresh
};
