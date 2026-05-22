const orderService = require('../services/order.service');
const { successResponse } = require('../utils/responseHandler');

const checkout = async (req, res, next) => {
    try {
        const order = await orderService.checkoutFromCart(req.user.id, req.body);
        return successResponse(res, 201, 'Đặt hàng thành công', { order });
    } catch (error) {
        next(error);
    }
};

const listMyOrders = async (req, res, next) => {
    try {
        const data = await orderService.listOrdersForUser(req.user.id, req.query);
        return successResponse(res, 200, 'OK', data);
    } catch (error) {
        next(error);
    }
};

const getMyOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrderByNumber(req.user.id, req.params.orderNumber);
        return successResponse(res, 200, 'OK', { order });
    } catch (error) {
        next(error);
    }
};

const cancelMyOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrderForUser(
            req.user.id,
            req.params.orderNumber,
            { reason: req.body?.reason }
        );
        const message = order.cancellationRequested
            ? 'Đã gửi yêu cầu hủy đơn cho shop'
            : 'Đã hủy đơn hàng thành công';
        return successResponse(res, 200, message, { order });
    } catch (error) {
        next(error);
    }
};

const getCheckoutInfo = async (req, res, next) => {
    try {
        return successResponse(res, 200, 'OK', {
            paymentMethods: [
                {
                    code: orderService.COD_METHOD,
                    name: 'Thanh toán khi nhận hàng (COD)',
                    description: 'Thanh toán tiền mặt khi nhận hàng tại địa chỉ giao.'
                }
            ],
            shippingFee: orderService.SHIPPING_FEE,
            codOnly: true
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkout,
    listMyOrders,
    getMyOrder,
    cancelMyOrder,
    getCheckoutInfo
};
