const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error.middleware');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// --- BƯỚC 1: CÁC MIDDLEWARE CƠ BẢN ---
// Parse JSON body
app.use(express.json());

// Parse urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse Cookie
app.use(cookieParser());

// --- BƯỚC 2: KHAI BÁO CÁC ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Xử lý Route không tồn tại
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    next(err);
});

// --- BƯỚC 3: MIDDLEWARE XỬ LÝ LỖI (ERROR HANDLER) ---
// Middleware này phải nằm ở cuối cùng
app.use(errorHandler);

module.exports = app;
