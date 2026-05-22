const express = require('express');
const { body, param } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { verifyToken, requirePermission } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(verifyToken);

const checkoutValidation = [
    body('paymentMethod')
        .equals('cod')
        .withMessage('Chỉ chấp nhận thanh toán COD'),
    body('shipping.recipientName').notEmpty().withMessage('Họ tên người nhận là bắt buộc'),
    body('shipping.phone').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    body('shipping.line1').notEmpty().withMessage('Địa chỉ là bắt buộc'),
    body('shipping.city').notEmpty().withMessage('Thành phố / Tỉnh là bắt buộc'),
    body('shipping.line2').optional().isString(),
    body('shipping.ward').optional().isString(),
    body('shipping.district').optional().isString(),
    body('note').optional().isString()
];

router.get('/checkout-info', requirePermission('orders:place'), orderController.getCheckoutInfo);

router.post(
    '/checkout',
    requirePermission('orders:place'),
    checkoutValidation,
    validate,
    orderController.checkout
);

router.get('/', requirePermission('orders:read'), orderController.listMyOrders);

const cancelValidation = [
    param('orderNumber').notEmpty(),
    body('reason').optional().isString().isLength({ max: 500 })
];

router.post(
    '/:orderNumber/cancel',
    requirePermission('orders:cancel'),
    cancelValidation,
    validate,
    orderController.cancelMyOrder
);

router.get(
    '/:orderNumber',
    requirePermission('orders:read'),
    param('orderNumber').notEmpty(),
    validate,
    orderController.getMyOrder
);

module.exports = router;
