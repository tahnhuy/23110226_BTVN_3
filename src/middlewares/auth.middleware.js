// TODO: Viết middleware xác thực Token và phân quyền (Role)
const verifyToken = (req, res, next) => {
    // Logic xác thực token
    next();
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        // Logic kiểm tra quyền
        next();
    };
};

module.exports = { verifyToken, authorize };
