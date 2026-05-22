import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchOrderByNumber,
    cancelOrder,
    clearOrderError
} from '../store/orderSlice';
import OrderStatusTimeline from '../components/orders/OrderStatusTimeline';
import { formatPrice } from '../utils/formatPrice';
import { STATUS_BADGE_CLASS, formatOrderDate } from '../utils/orderStatus';

export default function OrderTrackingPage() {
    const { orderNumber } = useParams();
    const dispatch = useAppDispatch();
    const { lastOrder: order, loading, cancelling, error } = useAppSelector((state) => state.order);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelForm, setShowCancelForm] = useState(false);

    useEffect(() => {
        if (orderNumber) {
            dispatch(fetchOrderByNumber(orderNumber));
        }
    }, [dispatch, orderNumber]);

    const handleCancel = async () => {
        if (!orderNumber || !order) return;
        const result = await dispatch(
            cancelOrder({ orderNumber, reason: cancelReason.trim() || undefined })
        );
        if (cancelOrder.fulfilled.match(result)) {
            setShowCancelForm(false);
            setCancelReason('');
        }
    };

    if (loading && !order) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <p className="text-error">{error}</p>
                <Link to="/orders" className="mt-4 inline-block text-primary hover:underline">
                    Về lịch sử đơn hàng
                </Link>
            </div>
        );
    }

    if (!order) return null;

    const badgeClass =
        STATUS_BADGE_CLASS[order.status] || 'bg-surface-container-high text-on-surface-variant';
    const showCancelAction =
        (order.canCancelDirect || order.canRequestCancel) &&
        order.status !== 'cancelled' &&
        order.status !== 'delivered';

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
                <nav className="mb-6 text-sm text-on-surface-variant">
                    <Link to="/orders" className="hover:text-primary">
                        Lịch sử đơn hàng
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-on-surface">#{order.orderNumber}</span>
                </nav>

                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Theo dõi đơn hàng</h1>
                        <p className="mt-2 text-on-surface-variant">
                            Đặt lúc {formatOrderDate(order.placedAt)}
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-4 py-1.5 text-sm font-bold ${badgeClass}`}
                    >
                        {order.statusLabel}
                    </span>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                        {error}
                        <button
                            type="button"
                            onClick={() => dispatch(clearOrderError())}
                            className="ml-4 font-semibold hover:underline"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {order.status === 'pending' && order.minutesUntilAutoConfirm != null && (
                    <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-surface">
                        Đơn sẽ được <strong>tự động xác nhận</strong> sau khoảng{' '}
                        <strong>{order.minutesUntilAutoConfirm} phút</strong> nếu shop chưa xác
                        nhận thủ công.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <OrderStatusTimeline
                            steps={order.trackingSteps}
                            status={order.status}
                            cancellationRequested={order.cancellationRequested}
                        />

                        {showCancelAction && (
                            <div className="mt-6 rounded-2xl border border-outline-variant/30 bg-surface p-6">
                                {!showCancelForm ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowCancelForm(true)}
                                        className="text-sm font-semibold text-error hover:underline"
                                    >
                                        {order.canCancelDirect
                                            ? 'Hủy đơn hàng (trong 30 phút đầu)'
                                            : 'Gửi yêu cầu hủy đơn cho shop'}
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-on-surface-variant">
                                            {order.canCancelDirect
                                                ? 'Bạn có thể hủy trực tiếp vì đơn mới đặt trong vòng 30 phút.'
                                                : 'Shop đang chuẩn bị hàng. Bạn có thể gửi yêu cầu hủy để shop xem xét.'}
                                        </p>
                                        <textarea
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            rows={2}
                                            placeholder="Lý do hủy (tuỳ chọn)"
                                            className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-sm outline-none focus:border-primary"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                disabled={cancelling}
                                                onClick={handleCancel}
                                                className="rounded-full bg-error px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
                                            >
                                                {cancelling
                                                    ? 'Đang xử lý...'
                                                    : order.canCancelDirect
                                                      ? 'Xác nhận hủy'
                                                      : 'Gửi yêu cầu hủy'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowCancelForm(false)}
                                                className="rounded-full border border-outline-variant px-5 py-2 text-sm font-semibold"
                                            >
                                                Huỷ bỏ
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6 lg:col-span-5">
                        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6">
                            <h2 className="mb-4 text-lg font-bold">Chi tiết thanh toán</h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-on-surface-variant">Tạm tính</dt>
                                    <dd>{formatPrice(order.subtotal)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-on-surface-variant">Phí ship</dt>
                                    <dd>
                                        {order.shippingFee > 0
                                            ? formatPrice(order.shippingFee)
                                            : 'Miễn phí'}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t border-outline-variant/30 pt-2 text-base font-bold">
                                    <dt>Tổng (COD)</dt>
                                    <dd className="text-primary">{formatPrice(order.total)}</dd>
                                </div>
                            </dl>
                            <p className="mt-4 text-xs text-on-surface-variant">
                                Thanh toán khi nhận hàng —{' '}
                                {order.payment?.status === 'pending' ? 'chưa thu' : order.payment?.status}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                            <h2 className="mb-3 text-lg font-bold">Giao đến</h2>
                            <p className="text-sm font-medium">{order.shippingSnapshot.recipientName}</p>
                            <p className="text-sm text-on-surface-variant">
                                {order.shippingSnapshot.phone}
                            </p>
                            <p className="mt-2 text-sm text-on-surface-variant">
                                {order.shippingSnapshot.line1}
                                {order.shippingSnapshot.ward
                                    ? `, ${order.shippingSnapshot.ward}`
                                    : ''}
                                {order.shippingSnapshot.district
                                    ? `, ${order.shippingSnapshot.district}`
                                    : ''}
                                , {order.shippingSnapshot.city}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                            <h2 className="mb-3 text-lg font-bold">Sản phẩm</h2>
                            <ul className="space-y-3">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between gap-2 text-sm border-b border-outline-variant/20 pb-3 last:border-0 last:pb-0"
                                    >
                                        <span>
                                            {item.quantity}× {item.productName}
                                        </span>
                                        <span className="font-medium shrink-0">
                                            {formatPrice(item.lineTotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
