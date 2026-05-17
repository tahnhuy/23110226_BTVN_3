import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import { formatPrice } from '../utils/formatPrice';
import type { ApiEnvelope } from '../types/api';
import type { ProductDetail, ProductReview } from '../types/catalog';

const DEMO_REVIEWS = [
    {
        id: 'demo-1',
        rating: 5,
        title: 'Essential for Freshman Year',
        comment:
            'Everything is high quality. The jumper wires do not feel cheap and the microcontroller is reliable. Used this for my entire robotics term project.',
        user: { fullName: 'Alex Johnson', username: 'alexj' },
        subtitle: 'Electrical Engineering, Year 1'
    },
    {
        id: 'demo-2',
        rating: 4,
        title: 'Great value for the price',
        comment:
            'Verified with my professors—this has everything needed for the labs. The case is a nice touch to keep things organized in my dorm.',
        user: { fullName: 'Sarah Chen', username: 'sarahc' },
        subtitle: 'Mechatronics, Year 2'
    },
    {
        id: 'demo-3',
        rating: 5,
        title: 'Professional Grade',
        comment:
            'The sensors are much more accurate than the ones I found online. Definitely worth spending the extra bit for the official shop kit.',
        user: { fullName: 'Marcus Rodriguez', username: 'marcusr' },
        subtitle: 'Mechanical Engineering, Year 1'
    }
];

function initials(name?: string | null, username?: string | null) {
    const base = name || username || '?';
    const parts = base.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return base.charAt(0).toUpperCase();
}

function StarRating({ value, size = 24 }: { value: number; size?: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
        const filled = value >= i;
        const half = !filled && value >= i - 0.5;
        stars.push(
            <span
                key={i}
                className={`material-symbols-outlined ${filled || half ? 'material-symbols-filled text-primary' : 'text-outline-variant'}`}
                style={{ fontSize: size }}
            >
                {half ? 'star_half' : 'star'}
            </span>
        );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
}

function buildSpecRows(product: ProductDetail): [string, string][] {
    const attrs = (product?.attributes ?? {}) as Record<string, unknown>;
    const rows: [string, string][] = [];

    const str = (v: unknown) => (Array.isArray(v) ? v.join(', ') : String(v ?? ''));

    if (attrs.microcontroller) rows.push(['Microcontroller', str(attrs.microcontroller)]);
    if (attrs.compatibility) rows.push(['Compatibility', str(attrs.compatibility)]);
    if (attrs.components) rows.push(['Components', str(attrs.components)]);
    if (attrs.voltage) rows.push(['Operating Voltage', str(attrs.voltage)]);
    if (attrs.sizes) rows.push(['Sizes', str(attrs.sizes)]);
    if (attrs.colors) rows.push(['Colors', str(attrs.colors)]);

    if (rows.length === 0) {
        rows.push(['SKU', product.sku || '—']);
        rows.push(['Condition', product.condition?.replace('_', ' ') || 'New']);
        rows.push(['Product type', product.productType === 'consignment' ? 'Consignment' : 'Standard']);
        if (product.stockQuantity != null) {
            rows.push(['Stock', `${product.stockQuantity} units available`]);
        }
    }

    return rows;
}

function ProductDetailFooter() {
    return (
        <footer className="mt-20 w-full bg-surface-container-low py-20">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-6 md:grid-cols-4 lg:px-8">
                <div className="col-span-2">
                    <div className="mb-4 text-2xl font-bold text-on-surface">UTEShop</div>
                    <p className="mb-6 max-w-xs text-base text-on-surface-variant">
                        Providing engineering students with the tools required for academic excellence and
                        innovation.
                    </p>
                    <p className="font-semibold text-on-surface">© 2024 UTEShop. Engineering-Grade Quality.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-on-surface">Shop</h4>
                    <nav className="flex flex-col gap-2">
                        <Link to="/categories?category=study-tools" className="text-xs text-on-surface-variant hover:text-primary">
                            Hardware Kits
                        </Link>
                        <Link to="/categories?category=technology" className="text-xs text-on-surface-variant hover:text-primary">
                            Technology
                        </Link>
                        <Link to="/categories" className="text-xs text-on-surface-variant hover:text-primary">
                            All Products
                        </Link>
                    </nav>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-on-surface">Support</h4>
                    <nav className="flex flex-col gap-2">
                        <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                            Student Support
                        </a>
                        <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                            Shipping
                        </a>
                        <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                            Contact
                        </a>
                    </nav>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-on-surface">Legal</h4>
                    <nav className="flex flex-col gap-2">
                        <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                            Privacy Policy
                        </a>
                        <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                            Terms of Service
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('specs');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get<ApiEnvelope<{ product: ProductDetail }>>(
                    `/catalog/products/${slug}`
                );
                if (!cancelled) {
                    setProduct(res.data?.product ?? null);
                    setSelectedImage(0);
                }
            } catch (err) {
                if (!cancelled) {
                    const msg =
                        typeof err === 'string'
                            ? err
                            : (err as { message?: string })?.message || 'Product not found';
                    setError(msg);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (slug) load();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    const images = useMemo(() => {
        if (!product?.images?.length) {
            return product?.imageUrl
                ? [{ url: product.imageUrl, altText: product.name }]
                : [{ url: '/PremiumLaptop.png', altText: product?.name || 'Product' }];
        }
        return product.images;
    }, [product]);

    const specRows = useMemo(() => (product ? buildSpecRows(product) : []), [product]);

    const reviews = useMemo(() => {
        if (!product) return [];
        if ((product.reviews?.length ?? 0) > 0) {
            return (product.reviews ?? []).map((r: ProductReview) => ({
                id: r.id,
                rating: r.rating,
                title: r.comment?.slice(0, 40) || 'Student review',
                comment: r.comment,
                user: r.user,
                subtitle: r.user?.fullName ? 'Verified student' : ''
            }));
        }
        return DEMO_REVIEWS;
    }, [product]);

    const reviewAverage =
        product?.reviewSummary?.count && product.reviewSummary.average != null
            ? product.reviewSummary.average
            : 4.8;
    const reviewCount = product?.reviewSummary?.count || 124;

    const inStock = (product?.stockQuantity ?? 0) > 0;
    const parentSlug = product?.category?.parent?.slug;
    const categorySlug = product?.category?.slug;
    const categoryName = product?.category?.name;
    const parentName = product?.category?.parent?.name;

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-[1280px] px-6 py-20 text-center lg:px-8">
                <p className="text-error">{error || 'Product not found'}</p>
                <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">
                    Back to Categories
                </Link>
            </div>
        );
    }

    const mainImage = images[selectedImage] || images[0];
    const thumbImages = images.length >= 4 ? images.slice(0, 4) : images;
    const extraCount = Math.max(0, images.length - 4);

    return (
        <div className="min-h-screen bg-surface text-on-surface antialiased">
            <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-8 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                    <Link to="/categories" className="hover:text-primary">
                        Categories
                    </Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    {parentSlug ? (
                        <>
                            <Link
                                to={`/categories?category=${parentSlug}`}
                                className="hover:text-primary"
                            >
                                {parentName || 'Category'}
                            </Link>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </>
                    ) : categorySlug ? (
                        <>
                            <Link
                                to={`/categories?category=${categorySlug}`}
                                className="hover:text-primary"
                            >
                                {categoryName}
                            </Link>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </>
                    ) : null}
                    <span className="font-semibold text-primary">{product.name}</span>
                </nav>

                {/* Hero */}
                <section className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-7">
                        <div className="soft-shadow flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-surface-container-low">
                            <img
                                src={mainImage.url}
                                alt={mainImage.altText || product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {thumbImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {thumbImages.map((img, index) => (
                                    <button
                                        key={img.id ?? index}
                                        type="button"
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square overflow-hidden rounded-xl bg-surface-container transition-all hover:ring-2 hover:ring-primary ${
                                            selectedImage === index ? 'ring-2 ring-primary' : ''
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                        {index === 3 && extraCount > 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-bold text-white">
                                                +{extraCount}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-28">
                        {product.isFeatured && (
                            <span className="mb-4 inline-flex items-center rounded-full bg-surface-container-highest px-3 py-1 text-xs font-semibold text-on-surface-variant">
                                NEW RELEASE
                            </span>
                        )}
                        <h1 className="mb-2 text-4xl font-bold leading-tight tracking-tight text-on-surface md:text-5xl">
                            {product.name}
                        </h1>
                        <p className="mb-6 text-lg text-on-surface-variant">
                            {product.shortDescription || product.description}
                        </p>

                        <div className="mb-8 flex flex-wrap items-center gap-4">
                            <span className="text-4xl font-bold text-primary">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice != null &&
                                product.compareAtPrice > product.price && (
                                    <>
                                        <span className="text-base text-on-surface-variant line-through">
                                            {formatPrice(product.compareAtPrice)}
                                        </span>
                                        {product.discountPercent != null && (
                                            <span className="rounded bg-tertiary-fixed px-2 py-1 text-xs font-semibold text-on-tertiary-fixed-variant">
                                                Save {product.discountPercent}%
                                            </span>
                                        )}
                                    </>
                                )}
                        </div>

                        <div className="mb-10 space-y-4">
                            <button
                                type="button"
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-primary text-sm font-bold text-on-primary transition hover:opacity-95 active:scale-95"
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                                Add to Cart
                            </button>
                            <button
                                type="button"
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-surface-container-low text-sm font-bold text-on-surface transition hover:bg-surface-container-high active:scale-95"
                            >
                                <span className="material-symbols-outlined">favorite</span>
                                Save to Wishlist
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-surface-container-low p-4">
                                <div className="mb-1 text-xs text-on-surface-variant">COMPATIBILITY</div>
                                <div className="font-bold">
                                    {String(product.attributes?.compatibility ?? 'Arduino / ESP32')}
                                </div>
                            </div>
                            <div className="rounded-xl bg-surface-container-low p-4">
                                <div className="mb-1 text-xs text-on-surface-variant">COMPONENTS</div>
                                <div className="font-bold">
                                    {String(product.attributes?.components ?? '140+ Pieces')}
                                </div>
                            </div>
                            <div className="rounded-xl bg-surface-container-low p-4">
                                <div className="mb-1 text-xs text-on-surface-variant">AVAILABILITY</div>
                                <div className={`flex items-center gap-1 font-bold ${inStock ? 'text-primary' : 'text-error'}`}>
                                    <span
                                        className={`h-2 w-2 rounded-full ${inStock ? 'bg-primary' : 'bg-error'}`}
                                    />
                                    {inStock ? 'In Stock' : 'Out of Stock'}
                                </div>
                            </div>
                            <div className="rounded-xl bg-surface-container-low p-4">
                                <div className="mb-1 text-xs text-on-surface-variant">SHIPPING</div>
                                <div className="font-bold">
                                    {inStock ? 'Same-Day Pickup' : 'Notify when available'}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="mt-20">
                    <div className="mb-12 border-b border-outline-variant">
                        <div className="flex gap-8 overflow-x-auto">
                            {[
                                { id: 'specs', label: 'Specifications' },
                                { id: 'box', label: 'Inside the Box' },
                                { id: 'majors', label: 'Course Alignment' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`shrink-0 pb-4 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-b-2 border-primary font-bold text-on-surface'
                                            : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                        {activeTab === 'specs' && (
                            <div className="space-y-12">
                                <h3 className="text-3xl font-semibold text-on-surface">Precision Control</h3>
                                <div className="space-y-6">
                                    {specRows.map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between border-b border-surface-container-highest pb-4"
                                        >
                                            <span className="text-on-surface-variant">{label}</span>
                                            <span className="text-right font-semibold text-on-surface">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'box' && (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-semibold text-on-surface">Inside the Box</h3>
                                <p className="text-base leading-relaxed text-on-surface-variant whitespace-pre-line">
                                    {product.description ||
                                        'Complete kit with all components required for introductory engineering labs.'}
                                </p>
                                {(product.tags?.length ?? 0) > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(product.tags ?? []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm text-on-surface-variant"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'majors' && (
                            <div className="soft-shadow rounded-[24px] bg-surface-container-low p-8 md:col-span-2">
                                <h3 className="mb-6 text-3xl font-semibold text-on-surface">
                                    Major Compatibility
                                </h3>
                                <p className="mb-8 text-base text-on-surface-variant">
                                    This product is recommended for students in the following programs:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {(product.majors?.length ?? 0) > 0 ? (
                                        (product.majors ?? []).map((m) => (
                                            <span
                                                key={m.id}
                                                className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm text-on-surface-variant"
                                            >
                                                {m.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-on-surface-variant">
                                            Suitable for all engineering majors.
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="soft-shadow rounded-[24px] bg-surface-container-low p-8">
                                <h3 className="mb-6 text-3xl font-semibold text-on-surface">
                                    Major Compatibility
                                </h3>
                                <p className="mb-8 text-base text-on-surface-variant">
                                    Verified and recommended for curriculum modules aligned with:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {(product.majors || []).map((m) => (
                                        <span
                                            key={m.id}
                                            className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm text-on-surface-variant"
                                        >
                                            {m.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Reviews */}
                <section className="mt-20">
                    <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="mb-2 text-4xl font-bold text-on-surface">Student Reviews</h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <StarRating value={reviewAverage} />
                                <span className="font-bold text-on-surface">
                                    {reviewAverage?.toFixed(1)} / 5.0
                                </span>
                                <span className="text-on-surface-variant">
                                    Based on {reviewCount} students
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded-full bg-surface-container-highest px-6 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-high"
                        >
                            Write a Review
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {reviews.slice(0, 3).map((review) => (
                            <div
                                key={review.id}
                                className="soft-shadow flex h-full flex-col rounded-[24px] bg-white p-8"
                            >
                                <StarRating value={review.rating} size={18} />
                                <p className="mb-3 mt-4 font-bold text-on-surface">{review.title}</p>
                                <p className="flex-grow text-base text-on-surface-variant">
                                    &quot;{review.comment}&quot;
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest text-sm font-bold text-primary">
                                        {initials(
                                            review.user?.fullName,
                                            review.user?.username
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-on-surface">
                                            {review.user?.fullName || review.user?.username}
                                        </div>
                                        {review.subtitle && (
                                            <div className="text-xs text-on-surface-variant">
                                                {review.subtitle}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <ProductDetailFooter />
        </div>
    );
}
