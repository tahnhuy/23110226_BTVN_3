// TODO: Viết global error handler để xử lý toàn bộ exception
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const body = {
        status: 'error',
        message: err.message || 'Internal Server Error'
    };
    if (process.env.NODE_ENV === 'development' && err.stack) {
        body.stack = err.stack;
    }
    res.status(statusCode).json(body);
};

module.exports = errorHandler;
