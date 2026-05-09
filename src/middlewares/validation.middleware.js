// TODO: Viết middleware xử lý kết quả validation từ express-validator
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    // Logic kiểm tra errors
    next();
};

module.exports = { validate };
