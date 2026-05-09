// TODO: Viết global error handler để xử lý toàn bộ exception
const errorHandler = (err, req, res, next) => {
    // Logic trả về response lỗi
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
