const AUTO_CONFIRM_MINUTES = Number(process.env.ORDER_AUTO_CONFIRM_MINUTES ?? 30);
const CANCEL_WINDOW_MINUTES = Number(process.env.ORDER_CANCEL_WINDOW_MINUTES ?? 30);

const TRACKING_STEPS = [
    { key: 'pending', label: 'Đơn hàng mới', description: 'Đơn vừa được đặt thành công' },
    {
        key: 'confirmed',
        label: 'Đã xác nhận đơn hàng',
        description: 'Shop xác nhận thủ công hoặc tự động sau 30 phút'
    },
    { key: 'processing', label: 'Shop đang chuẩn bị hàng', description: 'Đơn đang được đóng gói' },
    { key: 'shipping', label: 'Đang giao hàng', description: 'Shipper đang trên đường giao' },
    { key: 'delivered', label: 'Đã giao thành công', description: 'Bạn đã nhận hàng' }
];

const STATUS_LABELS = {
    pending: 'Đơn hàng mới',
    confirmed: 'Đã xác nhận',
    processing: 'Đang chuẩn bị hàng',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao thành công',
    cancelled: 'Đã hủy đơn hàng',
    refunded: 'Đã hoàn tiền'
};

const ACTIVE_FLOW = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];

function getPlacedAtDate(order) {
    return order.placedAt ? new Date(order.placedAt) : new Date(order.createdAt);
}

function minutesSince(date) {
    return (Date.now() - date.getTime()) / 60000;
}

function buildTrackingMeta(order) {
    const json = order.toJSON ? order.toJSON() : order;
    const status = json.status;
    const placedAt = getPlacedAtDate(json);
    const cancelWindowEndsAt = new Date(placedAt.getTime() + CANCEL_WINDOW_MINUTES * 60000);
    const autoConfirmAt = new Date(placedAt.getTime() + AUTO_CONFIRM_MINUTES * 60000);
    const cancellationRequested = Boolean(json.cancellationRequestedAt);

    const withinCancelWindow = minutesSince(placedAt) <= CANCEL_WINDOW_MINUTES;
    const canCancelDirect =
        withinCancelWindow && ['pending', 'confirmed'].includes(status) && !cancellationRequested;
    const canRequestCancel =
        status === 'processing' && !cancellationRequested && !json.cancelledAt;

    let currentStepIndex = ACTIVE_FLOW.indexOf(status);
    if (status === 'cancelled' || status === 'refunded') {
        currentStepIndex = -1;
    }

    const trackingSteps = TRACKING_STEPS.map((step, index) => {
        let stepState = 'upcoming';
        if (status === 'cancelled' || status === 'refunded') {
            stepState = 'cancelled';
        } else if (index < currentStepIndex) {
            stepState = 'completed';
        } else if (index === currentStepIndex) {
            stepState = cancellationRequested && step.key === 'processing' ? 'warning' : 'current';
        }
        return { ...step, state: stepState };
    });

    let statusLabel = STATUS_LABELS[status] || status;
    if (cancellationRequested && status === 'processing') {
        statusLabel = 'Đã gửi yêu cầu hủy — chờ shop xử lý';
    }

    return {
        statusLabel,
        trackingSteps,
        currentStepIndex,
        cancellationRequested,
        cancellationRequestedAt: json.cancellationRequestedAt || null,
        customerCancelReason: json.customerCancelReason || null,
        canCancelDirect,
        canRequestCancel,
        cancelWindowEndsAt: cancelWindowEndsAt.toISOString(),
        autoConfirmAt: autoConfirmAt.toISOString(),
        minutesUntilAutoConfirm:
            status === 'pending'
                ? Math.max(0, Math.ceil(AUTO_CONFIRM_MINUTES - minutesSince(placedAt)))
                : null,
        cancelWindowMinutes: CANCEL_WINDOW_MINUTES,
        autoConfirmMinutes: AUTO_CONFIRM_MINUTES
    };
}

module.exports = {
    AUTO_CONFIRM_MINUTES,
    CANCEL_WINDOW_MINUTES,
    TRACKING_STEPS,
    STATUS_LABELS,
    buildTrackingMeta,
    getPlacedAtDate
};
