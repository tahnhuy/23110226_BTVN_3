const User = require('../models/user.model');
const { successResponse } = require('../utils/responseHandler');

/**
 * Ví dụ endpoint chỉ admin: danh sách user (phân quyền qua route).
 */
const listUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt']
        });
        return successResponse(res, 200, 'Danh sách người dùng', { users });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listUsers
};
