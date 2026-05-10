const userService = require('../services/user.service');
const { successResponse } = require('../utils/responseHandler');

const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserPublicById(req.user.id);
        return successResponse(res, 200, 'OK', { user });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller: Cập nhật thông tin User (Edit Profile)
 * - Người dùng chỉ có thể cập nhật thông tin của chính họ (trừ phi là admin)
 * - Yêu cầu phải xác thực qua auth.middleware (req.user phải tồn tại)
 */
const editProfile = async (req, res, next) => {
    try {
        // Lấy ID user từ token (được set trong verifyToken middleware)
        const userId = req.user.id; 
        
        // Lấy dữ liệu update từ body request
        // Cần đảm bảo frontend chỉ gửi các trường được phép cập nhật (vd: username, status, v.v. Không gửi password ở đây)
        const updateData = req.body;

        // Xóa các trường không cho phép update trực tiếp qua API này
        delete updateData.password;
        delete updateData.role; 
        delete updateData.id;

        // Gọi service xử lý nghiệp vụ
        const updatedUser = await userService.updateUserProfile(userId, updateData);

        // Trả về response thành công
        return successResponse(res, 200, 'Profile updated successfully', {
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            }
        });
    } catch (error) {
        next(error); // Đẩy lỗi cho Error Middleware xử lý
    }
};

module.exports = {
    getMe,
    editProfile
};
