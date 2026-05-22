const { Op } = require('sequelize');
const {
    sequelize,
    Order,
    OrderItem,
    Payment,
    Cart,
    CartItem,
    Product,
    ProductVariant,
    User
} = require('../models');
const { getOrCreateActiveCart, resolveStock } = require('./cart.service');
const {
    AUTO_CONFIRM_MINUTES,
    CANCEL_WINDOW_MINUTES,
    buildTrackingMeta,
    getPlacedAtDate
} = require('../utils/orderTracking');

const SHIPPING_FEE = Number(process.env.SHIPPING_FEE ?? 0);
const COD_METHOD = 'cod';

const generateOrderNumber = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `UTE-${date}-${rand}`;
};

function mapOrderRow(order, items, payment) {
    const json = order.toJSON ? order.toJSON() : order;
    const tracking = buildTrackingMeta(json);
    return {
        id: json.id,
        orderNumber: json.orderNumber,
        status: json.status,
        subtotal: Number(json.subtotal),
        discountAmount: Number(json.discountAmount),
        shippingFee: Number(json.shippingFee),
        total: Number(json.total),
        note: json.note,
        shippingSnapshot: json.shippingSnapshot,
        placedAt: json.placedAt,
        createdAt: json.createdAt,
        confirmedAt: json.confirmedAt || null,
        cancelledAt: json.cancelledAt || null,
        shippedAt: json.shippedAt || null,
        deliveredAt: json.deliveredAt || null,
        ...tracking,
        items: (items || []).map((row) => {
            const item = row.toJSON ? row.toJSON() : row;
            return {
                id: item.id,
                productId: item.productId,
                variantId: item.variantId,
                productName: item.productName,
                sku: item.sku,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                lineTotal: Number(item.lineTotal)
            };
        }),
        payment: payment
            ? {
                  id: payment.id,
                  method: payment.method,
                  status: payment.status,
                  amount: Number(payment.amount)
              }
            : null
    };
}

const validateShipping = (shipping) => {
    if (!shipping || typeof shipping !== 'object') {
        const error = new Error('Thông tin giao hàng là bắt buộc');
        error.statusCode = 400;
        throw error;
    }
    const { recipientName, phone, line1, city } = shipping;
    if (!recipientName?.trim() || !phone?.trim() || !line1?.trim() || !city?.trim()) {
        const error = new Error('Vui lòng điền đủ họ tên, SĐT, địa chỉ và thành phố');
        error.statusCode = 400;
        throw error;
    }
    return {
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        line1: line1.trim(),
        line2: shipping.line2?.trim() || null,
        ward: shipping.ward?.trim() || null,
        district: shipping.district?.trim() || null,
        city: city.trim()
    };
};

const checkoutFromCart = async (userId, payload) => {
    const { paymentMethod, shipping, note } = payload;

    if (paymentMethod !== COD_METHOD) {
        const error = new Error('Hiện chỉ hỗ trợ thanh toán COD (thanh toán khi nhận hàng)');
        error.statusCode = 400;
        throw error;
    }

    const shippingSnapshot = validateShipping(shipping);
    const user = await User.findByPk(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const cart = await getOrCreateActiveCart(userId);
    const cartItems = await CartItem.findAll({
        where: { cartId: cart.id, isSelected: true },
        include: [
            { model: Product, as: 'product' },
            { model: ProductVariant, as: 'variant', required: false }
        ]
    });

    if (cartItems.length === 0) {
        const error = new Error('Chưa chọn sản phẩm nào để thanh toán');
        error.statusCode = 400;
        throw error;
    }

    for (const row of cartItems) {
        const product = row.product;
        if (!product || product.status !== 'active') {
            const error = new Error(`Sản phẩm "${product?.name || row.productId}" không còn bán`);
            error.statusCode = 400;
            throw error;
        }
        const stock = await resolveStock(row.productId, row.variantId);
        if (row.quantity > stock) {
            const error = new Error(
                `"${product.name}" chỉ còn ${stock} sản phẩm trong kho`
            );
            error.statusCode = 400;
            throw error;
        }
    }

    const subtotal = cartItems.reduce(
        (sum, row) => sum + Number(row.unitPrice) * row.quantity,
        0
    );
    const shippingFee = SHIPPING_FEE;
    const discountAmount = 0;
    const total = Math.round((subtotal + shippingFee - discountAmount) * 100) / 100;

    const t = await sequelize.transaction();

    try {
        const orderNumber = generateOrderNumber();
        const order = await Order.create(
            {
                orderNumber,
                userId,
                guestEmail: user.email,
                guestPhone: shippingSnapshot.phone,
                shippingSnapshot,
                status: 'pending',
                subtotal: Math.round(subtotal * 100) / 100,
                discountAmount,
                shippingFee,
                total,
                note: note?.trim() || null,
                placedAt: new Date()
            },
            { transaction: t }
        );

        const orderItemRows = [];
        for (const row of cartItems) {
            const product = row.product;
            const variant = row.variant;
            const lineTotal = Math.round(Number(row.unitPrice) * row.quantity * 100) / 100;

            const orderItem = await OrderItem.create(
                {
                    orderId: order.id,
                    productId: row.productId,
                    variantId: row.variantId,
                    productName: product.name,
                    sku: variant?.sku || product.sku || null,
                    quantity: row.quantity,
                    unitPrice: row.unitPrice,
                    lineTotal
                },
                { transaction: t }
            );
            orderItemRows.push(orderItem);

            if (variant) {
                await variant.decrement('stockQuantity', { by: row.quantity, transaction: t });
            } else {
                await product.decrement('stockQuantity', { by: row.quantity, transaction: t });
            }
        }

        const payment = await Payment.create(
            {
                orderId: order.id,
                method: COD_METHOD,
                status: 'pending',
                amount: total
            },
            { transaction: t }
        );

        await CartItem.destroy({
            where: {
                id: { [Op.in]: cartItems.map((r) => r.id) }
            },
            transaction: t
        });

        const remaining = await CartItem.count({
            where: { cartId: cart.id },
            transaction: t
        });
        if (remaining === 0) {
            await cart.update({ status: 'converted' }, { transaction: t });
        }

        await t.commit();
        return mapOrderRow(order, orderItemRows, payment);
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const runAutoConfirmPendingOrders = async () => {
    const cutoff = new Date(Date.now() - AUTO_CONFIRM_MINUTES * 60 * 1000);
    const [updated] = await Order.update(
        { status: 'confirmed', confirmedAt: new Date() },
        {
            where: {
                status: 'pending',
                placedAt: { [Op.lte]: cutoff }
            }
        }
    );
    return updated;
};

const restoreOrderStock = async (orderId, transaction) => {
    const items = await OrderItem.findAll({
        where: { orderId },
        include: [
            { model: Product, as: 'product' },
            { model: ProductVariant, as: 'variant', required: false }
        ],
        transaction
    });

    for (const row of items) {
        if (row.variant) {
            await row.variant.increment('stockQuantity', { by: row.quantity, transaction });
        } else if (row.product) {
            await row.product.increment('stockQuantity', { by: row.quantity, transaction });
        }
    }
};

const performOrderCancellation = async (order, { reason, isRequest = false } = {}) => {
    if (isRequest) {
        await order.update({
            cancellationRequestedAt: new Date(),
            customerCancelReason: reason?.trim() || null
        });
        return order;
    }

    const t = await sequelize.transaction();
    try {
        await restoreOrderStock(order.id, t);
        await order.update(
            {
                status: 'cancelled',
                cancelledAt: new Date(),
                customerCancelReason: reason?.trim() || order.customerCancelReason || null
            },
            { transaction: t }
        );

        const payment = await Payment.findOne({ where: { orderId: order.id }, transaction: t });
        if (payment) {
            await payment.update({ status: 'refunded' }, { transaction: t });
        }

        await t.commit();
        return order;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const cancelOrderForUser = async (userId, orderNumber, { reason } = {}) => {
    await runAutoConfirmPendingOrders();

    const order = await Order.findOne({
        where: { orderNumber, userId },
        include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }]
    });

    if (!order) {
        const error = new Error('Đơn hàng không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    if (['cancelled', 'refunded', 'delivered', 'shipping'].includes(order.status)) {
        const error = new Error('Không thể hủy đơn ở trạng thái hiện tại');
        error.statusCode = 400;
        throw error;
    }

    const placedAt = getPlacedAtDate(order);
    const withinWindow = (Date.now() - placedAt.getTime()) / 60000 <= CANCEL_WINDOW_MINUTES;

    if (order.status === 'processing') {
        if (order.cancellationRequestedAt) {
            const error = new Error('Bạn đã gửi yêu cầu hủy cho đơn này');
            error.statusCode = 400;
            throw error;
        }
        await performOrderCancellation(order, { reason, isRequest: true });
        return getOrderByNumber(userId, orderNumber);
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
        const error = new Error('Không thể hủy đơn ở trạng thái hiện tại');
        error.statusCode = 400;
        throw error;
    }

    if (!withinWindow) {
        const error = new Error(
            `Chỉ có thể hủy trực tiếp trong ${CANCEL_WINDOW_MINUTES} phút sau khi đặt hàng`
        );
        error.statusCode = 400;
        throw error;
    }

    await performOrderCancellation(order, { reason, isRequest: false });
    return getOrderByNumber(userId, orderNumber);
};

const listOrdersForUser = async (userId, { page = 1, limit = 10 } = {}) => {
    await runAutoConfirmPendingOrders();

    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(50, Math.max(1, Number(limit) || 10));
    const offset = (p - 1) * l;

    const { rows, count } = await Order.findAndCountAll({
        where: { userId },
        include: [
            { model: Payment, as: 'payment', attributes: ['method', 'status', 'amount'] },
            {
                model: OrderItem,
                as: 'items',
                attributes: ['id', 'productName', 'quantity', 'lineTotal']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: l,
        offset,
        distinct: true
    });

    return {
        orders: rows.map((order) => {
            const json = order.toJSON();
            const tracking = buildTrackingMeta(json);
            const firstItem = (json.items || [])[0];
            return {
                id: json.id,
                orderNumber: json.orderNumber,
                status: json.status,
                statusLabel: tracking.statusLabel,
                currentStepIndex: tracking.currentStepIndex,
                cancellationRequested: tracking.cancellationRequested,
                total: Number(json.total),
                placedAt: json.placedAt,
                createdAt: json.createdAt,
                itemCount: (json.items || []).reduce((s, i) => s + i.quantity, 0),
                previewProductName: firstItem?.productName || null,
                payment: json.payment
                    ? {
                          method: json.payment.method,
                          status: json.payment.status,
                          amount: Number(json.payment.amount)
                      }
                    : null
            };
        }),
        pagination: { page: p, limit: l, total: count, totalPages: Math.ceil(count / l) }
    };
};

const getOrderByNumber = async (userId, orderNumber) => {
    await runAutoConfirmPendingOrders();

    const order = await Order.findOne({
        where: { orderNumber, userId },
        include: [
            { model: OrderItem, as: 'items' },
            { model: Payment, as: 'payment' }
        ]
    });

    if (!order) {
        const error = new Error('Đơn hàng không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    return mapOrderRow(order, order.items, order.payment);
};

module.exports = {
    checkoutFromCart,
    listOrdersForUser,
    getOrderByNumber,
    cancelOrderForUser,
    runAutoConfirmPendingOrders,
    SHIPPING_FEE,
    COD_METHOD,
    AUTO_CONFIRM_MINUTES,
    CANCEL_WINDOW_MINUTES
};
