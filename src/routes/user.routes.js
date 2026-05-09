const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

// Tất cả API của user đều yêu cầu đăng nhập
router.use(verifyToken);

// Validation Rule cho Edit Profile
const editProfileValidation = [
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('Invalid email format')
];

// PUT /api/users/profile
// - Sử dụng middleware verifyToken (từ router.use) để đảm bảo req.user tồn tại
// - Sử dụng express-validator để kiểm tra dữ liệu đầu vào
router.put('/profile', editProfileValidation, validate, userController.editProfile);

module.exports = router;
