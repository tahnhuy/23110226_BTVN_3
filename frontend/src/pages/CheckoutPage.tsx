import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart } from '../store/cartSlice';
import { fetchUserProfile } from '../store/profileSlice';
import { fetchCheckoutInfo, placeOrder, clearOrderError } from '../store/orderSlice';
import { formatPrice } from '../utils/formatPrice';
import type { ShippingInfo } from '../types/order';

const PRIMARY = '#004AC6';

function parseAddressToLine1(address?: string | null) {
    if (!address?.trim()) return '';
    return address.trim();
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, summary } = useAppSelector((state) => state.cart);
    const profile = useAppSelector((state) => state.profile.user);
    const { checkoutInfo, placing, error } = useAppSelector((state) => state.order);

    const selectedItems = useMemo(() => items.filter((i) => i.isSelected), [items]);

    const [recipientName, setRecipientName] = useState('');
    const [phone, setPhone] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('Ho Chi Minh City');
    const [note, setNote] = useState('');

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchCheckoutInfo());
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setRecipientName(profile.fullName || profile.username || '');
            setPhone(profile.phone || '');
            setLine1(parseAddressToLine1(profile.address));
        }
    }, [profile]);

    useEffect(() => {
        if (summary.selectedItemCount === 0 && items.length > 0) {
            navigate('/cart', { replace: true });
        }
    }, [summary.selectedItemCount, items.length, navigate]);

    const shippingFee = checkoutInfo?.shippingFee ?? 0;
    const total = summary.selectedSubtotal + shippingFee;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearOrderError());

        const shipping: ShippingInfo = {
            recipientName: recipientName.trim(),
            phone: phone.trim(),
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            ward: ward.trim() || undefined,
            district: district.trim() || undefined,
            city: city.trim()
        };

        const result = await dispatch(
            placeOrder({
                paymentMethod: 'cod',
                shipping,
                note: note.trim() || undefined
            })
        );

        if (placeOrder.fulfilled.match(result)) {
            dispatch(fetchCart());
            navigate(`/orders/success/${result.payload.orderNumber}`, { replace: true });
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
                <nav className="mb-6 text-sm text-on-surface-variant">
                    <Link to="/cart" className="hover:text-primary">
                        Giỏ hàng
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-on-surface">Thanh toán</span>
                </nav>

                <h1 className="mb-8 text-3xl font-bold tracking-tight">Thanh toán đơn hàng</h1>

                {error && (
                    <div className="mb-6 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="space-y-8 lg:col-span-7">
                        <section className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                            <h2 className="mb-4 text-lg font-bold">Địa chỉ giao hàng</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block sm:col-span-2">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Họ và tên *
                                    </span>
                                    <input
                                        required
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Số điện thoại *
                                    </span>
                                    <input
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Thành phố / Tỉnh *
                                    </span>
                                    <input
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block sm:col-span-2">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Địa chỉ (số nhà, đường) *
                                    </span>
                                    <input
                                        required
                                        value={line1}
                                        onChange={(e) => setLine1(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Phường / Xã
                                    </span>
                                    <input
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Quận / Huyện
                                    </span>
                                    <input
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="block sm:col-span-2">
                                    <span className="mb-1 block text-sm font-medium text-on-surface-variant">
                                        Ghi chú đơn hàng
                                    </span>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-xl border border-outline-variant/40 px-4 py-3 text-on-surface outline-none focus:border-primary"
                                        placeholder="Giao giờ hành chính, gọi trước khi giao..."
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                            <h2 className="mb-4 text-lg font-bold">Phương thức thanh toán</h2>
                            <div
                                className="flex items-start gap-4 rounded-xl border-2 p-4"
                                style={{ borderColor: PRIMARY, backgroundColor: `${PRIMARY}08` }}
                            >
                                <input
                                    type="radio"
                                    checked
                                    readOnly
                                    className="mt-1 h-5 w-5 accent-primary"
                                    aria-label="COD"
                                />
                                <div>
                                    <p className="font-bold text-on-surface">
                                        Thanh toán khi nhận hàng (COD)
                                    </p>
                                    <p className="mt-1 text-sm text-on-surface-variant">
                                        Thanh toán tiền mặt trực tiếp khi nhận hàng. Đây là phương thức
                                        duy nhất hiện có.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-5">
                        <div className="sticky top-28 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6">
                            <h2 className="mb-4 text-lg font-bold">
                                Đơn hàng ({summary.selectedItemCount} món)
                            </h2>
                            <ul className="mb-4 max-h-48 space-y-2 overflow-y-auto text-sm">
                                {selectedItems.map((line) => (
                                    <li key={line.id} className="flex justify-between gap-2">
                                        <span className="min-w-0 truncate text-on-surface-variant">
                                            {line.quantity}× {line.product.name}
                                        </span>
                                        <span className="shrink-0 font-medium">
                                            {formatPrice(line.lineTotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="space-y-2 border-t border-outline-variant/30 pt-4 text-sm">
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(summary.selectedSubtotal)}</span>
                                </div>
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Phí vận chuyển</span>
                                    <span>
                                        {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 text-lg font-bold">
                                    <span>Tổng thanh toán (COD)</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={placing}
                                className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary transition hover:opacity-95 disabled:opacity-60"
                            >
                                {placing ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng COD'}
                            </button>
                            <Link
                                to="/cart"
                                className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                            >
                                Quay lại giỏ hàng
                            </Link>
                        </div>
                    </aside>
                </form>
            </main>
        </div>
    );
}
