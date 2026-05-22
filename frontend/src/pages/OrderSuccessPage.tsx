import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrderByNumber, clearOrderError } from '../store/orderSlice';
import { formatPrice } from '../utils/formatPrice';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền'
};

export default function OrderSuccessPage() {
    const { orderNumber } = useParams();
    const dispatch = useAppDispatch();
    const { lastOrder, loading, error } = useAppSelector((state) => state.order);

    useEffect(() => {
        if (orderNumber) {
            dispatch(fetchOrderByNumber(orderNumber));
        }
        return () => {
            dispatch(clearOrderError());
        };
    }, [dispatch, orderNumber]);

    if (loading && !lastOrder) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    const order = lastOrder;

    if (error || !order) {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <p className="text-error">{error || 'Không tìm thấy đơn hàng'}</p>
                <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <main className="mx-auto max-w-[720px] px-6 py-16 lg:px-8">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                    <span className="material-symbols-outlined mb-4 text-5xl text-primary">
                        check_circle
                    </span>
                    <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
                    <p className="mt-2 text-on-surface-variant">
                        Cảm ơn bạn. Đơn hàng đang chờ xác nhận — thanh toán COD khi nhận hàng.
                    </p>
                </div>

                <div className="mt-8 rounded-2xl border border-outline-variant/30 bg-surface p-6">
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-on-surface-variant">Mã đơn hàng</dt>
                            <dd className="font-bold text-primary">{order.orderNumber}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-on-surface-variant">Trạng thái</dt>
                            <dd className="font-semibold">
                                {STATUS_LABELS[order.status] || order.status}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-on-surface-variant">Thanh toán</dt>
                            <dd className="font-semibold">
                                COD — {order.payment?.status === 'pending' ? 'Chưa thu' : order.payment?.status}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-outline-variant/30 pt-3 text-base">
                            <dt className="font-bold">Tổng tiền</dt>
                            <dd className="font-bold text-primary">{formatPrice(order.total)}</dd>
                        </div>
                    </dl>

                    <div className="mt-6 rounded-xl bg-surface-container-low p-4 text-sm">
                        <p className="font-semibold text-on-surface">Giao đến</p>
                        <p className="mt-1 text-on-surface-variant">
                            {order.shippingSnapshot.recipientName} · {order.shippingSnapshot.phone}
                        </p>
                        <p className="text-on-surface-variant">
                            {order.shippingSnapshot.line1}
                            {order.shippingSnapshot.ward ? `, ${order.shippingSnapshot.ward}` : ''}
                            {order.shippingSnapshot.district
                                ? `, ${order.shippingSnapshot.district}`
                                : ''}
                            , {order.shippingSnapshot.city}
                        </p>
                    </div>

                    <ul className="mt-6 space-y-2 border-t border-outline-variant/30 pt-4 text-sm">
                        {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span>
                                    {item.quantity}× {item.productName}
                                </span>
                                <span className="font-medium">{formatPrice(item.lineTotal)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        to={`/orders/${order.orderNumber}`}
                        className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:opacity-95"
                    >
                        Theo dõi đơn hàng
                    </Link>
                    <Link
                        to="/orders"
                        className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
                    >
                        Lịch sử đơn hàng
                    </Link>
                    <Link
                        to="/categories"
                        className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </main>
        </div>
    );
}
