/**
 * Định nghĩa chuẩn response trả về cho API
 */
const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

const errorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        errors
    });
};

module.exports = {
    successResponse,
    errorResponse
};
