import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchCart,
    updateCartItem,
    removeCartItem,
    setCartItemSelected,
    setCartSelectionAll,
    clearCartError
} from '../store/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import QuantitySelector from '../components/catalog/QuantitySelector';
import type { CartItemLine } from '../types/cart';

function CartLineRow({
    line,
    updating,
    removing,
    selecting,
    onToggleSelect,
    onQuantityChange,
    onRemove
}: {
    line: CartItemLine;
    updating: boolean;
    removing: boolean;
    selecting: boolean;
    onToggleSelect: () => void;
    onQuantityChange: (qty: number) => void;
    onRemove: () => void;
}) {
    const maxQty = line.variant?.stockQuantity ?? line.product.stockQuantity ?? 1;
    const imageUrl = line.product.imageUrl || '/PremiumLaptop.png';
    const outOfStock = maxQty < 1 || line.product.status !== 'active';

    return (
        <article
            className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:gap-6 ${
                line.isSelected
                    ? 'border-primary/30 bg-surface'
                    : 'border-outline-variant/30 bg-surface-container-lowest opacity-90'
            }`}
        >
            <div className="flex items-start gap-3 sm:items-center">
                <label className="flex cursor-pointer items-center pt-1 sm:pt-0">
                    <input
                        type="checkbox"
                        checked={line.isSelected}
                        disabled={selecting || removing}
                        onChange={onToggleSelect}
                        className="h-5 w-5 shrink-0 cursor-pointer rounded border-outline-variant accent-primary disabled:cursor-not-allowed"
                        aria-label={`Chọn ${line.product.name} để thanh toán`}
                    />
                </label>
                <Link
                    to={`/products/${line.product.slug}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-surface-container-low"
                >
                    <img
                        src={imageUrl}
                        alt={line.product.name}
                        className="h-28 w-28 object-cover sm:h-24 sm:w-24"
                    />
                </Link>
            </div>
            <div className="min-w-0 flex-1">
                <Link
                    to={`/products/${line.product.slug}`}
                    className="text-lg font-semibold text-on-surface hover:text-primary"
                >
                    {line.product.name}
                </Link>
                {line.variant && (
                    <p className="mt-1 text-sm text-on-surface-variant">{line.variant.name}</p>
                )}
                <p className="mt-2 text-base font-bold text-primary">
                    {formatPrice(line.unitPrice)}
                </p>
                {outOfStock && (
                    <p className="mt-1 text-sm text-error">Sản phẩm không còn khả dụng</p>
                )}
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <QuantitySelector
                    value={line.quantity}
                    max={Math.max(1, maxQty)}
                    disabled={outOfStock || updating || removing}
                    onChange={onQuantityChange}
                />
                <p className="text-right text-sm font-semibold text-on-surface">
                    {formatPrice(line.lineTotal)}
                </p>
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={removing}
                    className="text-sm font-medium text-error transition hover:underline disabled:opacity-50"
                >
                    {removing ? 'Đang xóa...' : 'Xóa'}
                </button>
            </div>
        </article>
    );
}

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, summary, status, error, updateLoadingId, removeLoadingId, selectLoadingId, selectAllLoading } =
        useAppSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleQuantityChange = (line: CartItemLine, quantity: number) => {
        if (quantity === line.quantity) return;
        dispatch(updateCartItem({ itemId: line.id, quantity }));
    };

    const handleRemove = (itemId: number) => {
        dispatch(removeCartItem(itemId));
    };

    const handleToggleSelect = (line: CartItemLine) => {
        dispatch(setCartItemSelected({ itemId: line.id, isSelected: !line.isSelected }));
    };

    const handleSelectAll = () => {
        dispatch(setCartSelectionAll({ isSelected: !summary.allSelected }));
    };

    const canCheckout = summary.selectedItemCount > 0;

    if (status === 'loading' && items.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
                <h1 className="mb-2 text-3xl font-bold tracking-tight">Giỏ hàng</h1>
                <p className="mb-8 text-on-surface-variant">
                    {summary.itemCount > 0
                        ? `${summary.itemCount} sản phẩm trong giỏ · Đã chọn ${summary.selectedItemCount} để thanh toán`
                        : 'Giỏ hàng của bạn đang trống'}
                </p>

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => dispatch(clearCartError())}
                            className="font-semibold hover:underline"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-low px-8 py-16 text-center">
                        <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant">
                            shopping_cart
                        </span>
                        <p className="mb-6 text-lg text-on-surface-variant">
                            Bạn chưa có sản phẩm nào trong giỏ
                        </p>
                        <Link
                            to="/categories"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-8">
                            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-on-surface">
                                    <input
                                        type="checkbox"
                                        checked={summary.allSelected}
                                        disabled={selectAllLoading}
                                        onChange={handleSelectAll}
                                        className="h-5 w-5 cursor-pointer rounded accent-primary disabled:opacity-50"
                                    />
                                    Chọn tất cả ({items.length})
                                </label>
                            </div>
                            {items.map((line) => (
                                <CartLineRow
                                    key={line.id}
                                    line={line}
                                    updating={updateLoadingId === line.id}
                                    removing={removeLoadingId === line.id}
                                    selecting={selectLoadingId === line.id}
                                    onToggleSelect={() => handleToggleSelect(line)}
                                    onQuantityChange={(qty) => handleQuantityChange(line, qty)}
                                    onRemove={() => handleRemove(line.id)}
                                />
                            ))}
                        </div>
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6">
                                <h2 className="mb-4 text-lg font-bold">Thanh toán</h2>
                                <div className="mb-2 flex justify-between text-sm text-on-surface-variant">
                                    <span>Tổng giỏ ({summary.itemCount} món)</span>
                                    <span>{formatPrice(summary.subtotal)}</span>
                                </div>
                                <div className="mb-2 flex justify-between text-sm font-semibold text-on-surface">
                                    <span>Đã chọn ({summary.selectedItemCount} món)</span>
                                    <span className="text-primary">
                                        {formatPrice(summary.selectedSubtotal)}
                                    </span>
                                </div>
                                <div className="mb-6 flex justify-between text-sm text-on-surface-variant">
                                    <span>Phí vận chuyển</span>
                                    <span>Tính khi thanh toán</span>
                                </div>
                                <div className="mb-6 flex justify-between border-t border-outline-variant/30 pt-4 text-lg font-bold">
                                    <span>Tổng thanh toán</span>
                                    <span className="text-primary">
                                        {formatPrice(summary.selectedSubtotal)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    disabled={!canCheckout}
                                    onClick={() => canCheckout && navigate('/checkout')}
                                    className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-primary/40"
                                    title={
                                        canCheckout
                                            ? undefined
                                            : 'Chọn ít nhất một sản phẩm để thanh toán'
                                    }
                                >
                                    {canCheckout
                                        ? `Thanh toán COD (${summary.selectedItemCount} món)`
                                        : 'Chọn sản phẩm để thanh toán'}
                                </button>
                                <Link
                                    to="/categories"
                                    className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                                >
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}
