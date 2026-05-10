const User = require('../models/user.model');

/**
 * Service: Cập nhật Profile User trong Database
 */
const updateUserProfile = async (userId, updateData) => {
    // 1. Tìm User trong DB
    const user = await User.findByPk(userId);
    
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    // 2. Nếu có đổi email, kiểm tra xem email đã tồn tại chưa (tùy chọn)
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ where: { email: updateData.email } });
        if (existingUser) {
            const error = new Error('Email is already in use');
            error.statusCode = 400;
            throw error;
        }
    }

    // 3. Thực hiện update dữ liệu
    await user.update(updateData);

    return user;
};

const getUserPublicById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt', 'updatedAt']
    });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

module.exports = {
    updateUserProfile,
    getUserPublicById
};
