const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, requirePermission } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(verifyToken);

const editProfileValidation = [
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('Invalid email format')
];

router.get('/me', requirePermission('profile:read'), userController.getMe);

router.put(
    '/profile',
    requirePermission('profile:update'),
    editProfileValidation,
    validate,
    userController.editProfile
);

module.exports = router;
