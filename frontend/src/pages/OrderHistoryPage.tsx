import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders, clearOrderError } from '../store/orderSlice';
import { formatPrice } from '../utils/formatPrice';
import { STATUS_BADGE_CLASS, formatOrderDate } from '../utils/orderStatus';

function stepProgress(currentStepIndex: number, status: string): number {
    if (status === 'cancelled' || status === 'refunded') return 0;
    return Math.max(0, Math.min(4, currentStepIndex + 1));
}

export default function OrderHistoryPage() {
    const dispatch = useAppDispatch();
    const { orders, listLoading, error, pagination } = useAppSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, limit: 20 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
                <h1 className="mb-2 text-3xl font-bold tracking-tight">Lịch sử mua hàng</h1>
                <p className="mb-8 text-on-surface-variant">
                    Xem và theo dõi tất cả đơn hàng của bạn
                </p>

                {error && (
                    <div className="mb-6 flex justify-between rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => dispatch(clearOrderError())}
                            className="font-semibold hover:underline"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {listLoading && orders.length === 0 ? (
                    <div className="flex min-h-[40vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-low px-8 py-16 text-center">
                        <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant">
                            shopping_bag
                        </span>
                        <p className="mb-6 text-lg text-on-surface-variant">Chưa có đơn hàng nào</p>
                        <Link
                            to="/categories"
                            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => {
                            const filled = stepProgress(order.currentStepIndex, order.status);
                            const badgeClass =
                                STATUS_BADGE_CLASS[order.status] ||
                                'bg-surface-container-high text-on-surface-variant';

                            return (
                                <article
                                    key={order.id}
                                    className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 transition hover:border-primary/20"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
                                                >
                                                    {order.statusLabel}
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    #{order.orderNumber}
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    {formatOrderDate(order.placedAt)}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-on-surface">
                                                {order.previewProductName ||
                                                    `${order.itemCount} sản phẩm`}
                                                {order.itemCount > 1
                                                    ? ` và ${order.itemCount - 1} món khác`
                                                    : ''}
                                            </h3>
                                            {order.cancellationRequested && (
                                                <p className="mt-1 text-sm text-amber-800">
                                                    Đã gửi yêu cầu hủy — chờ shop xử lý
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-2">
                                            <span className="text-2xl font-bold text-primary">
                                                {formatPrice(order.total)}
                                            </span>
                                            <Link
                                                to={`/orders/${order.orderNumber}`}
                                                className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-on-primary transition hover:opacity-95"
                                            >
                                                Theo dõi đơn
                                            </Link>
                                        </div>
                                    </div>
                                    {filled > 0 && order.status !== 'cancelled' && (
                                        <div className="mt-4 flex items-center gap-2">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full ${
                                                        i < filled ? 'bg-primary' : 'bg-surface-container'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                        {pagination && pagination.totalPages > 1 && (
                            <p className="text-center text-sm text-on-surface-variant">
                                Trang {pagination.page} / {pagination.totalPages} ({pagination.total}{' '}
                                đơn)
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
