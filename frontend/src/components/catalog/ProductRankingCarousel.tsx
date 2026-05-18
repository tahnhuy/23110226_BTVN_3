import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { formatPrice } from '../../utils/formatPrice';
import type { CatalogProduct } from '../../types/catalog';

import 'swiper/css';
import 'swiper/css/pagination';

const PRIMARY = '#004AC6';
const TEXT = '#191B23';
const TEXT_BODY = '#434655';

function categoryLabel(product: CatalogProduct) {
    const c = product.category;
    if (!c) return 'General';
    if (c.parentName) return c.parentName;
    return c.name;
}

function RankingProductCard({
    product,
    statType
}: {
    product: CatalogProduct;
    statType: 'sold' | 'views';
}) {
    const statValue =
        statType === 'sold' ? (product.soldCount ?? 0) : (product.viewCount ?? 0);
    const statLabel = statType === 'sold' ? 'sold' : 'views';

    return (
        <Link to={`/products/${product.slug}`} className="group block h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                <div className="h-64 overflow-hidden sm:h-72" style={{ backgroundColor: '#EDE9FA' }}>
                    <img
                        src={product.imageUrl || '/PremiumLaptop.png'}
                        alt={product.imageAlt || product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                    <span
                        className="font-inter text-xs font-medium uppercase tracking-wide"
                        style={{ color: PRIMARY }}
                    >
                        {categoryLabel(product)}
                    </span>
                    <h3
                        className="font-inter text-lg font-semibold leading-snug line-clamp-2"
                        style={{ color: TEXT }}
                    >
                        {product.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <p className="font-inter text-xl font-semibold" style={{ color: TEXT }}>
                            {formatPrice(product.price)}
                        </p>
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition group-hover:opacity-90"
                            style={{ backgroundColor: PRIMARY }}
                            aria-hidden
                        >
                            <FiShoppingCart className="h-4 w-4" strokeWidth={2} />
                        </span>
                    </div>
                    {statValue > 0 && (
                        <p className="font-inter text-xs" style={{ color: TEXT_BODY }}>
                            {statValue.toLocaleString()} {statLabel}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}

export default function ProductRankingCarousel({
    id,
    title,
    products,
    viewAllTo,
    statType,
    background
}: {
    id: string;
    title: string;
    products: CatalogProduct[];
    viewAllTo: string;
    statType: 'sold' | 'views';
    background?: string;
}) {
    const swiperRef = useRef<SwiperType | null>(null);

    if (products.length === 0) return null;

    return (
        <section
            id={id}
            className="scroll-mt-24 w-full px-6 py-20 lg:px-8"
            style={background ? { backgroundColor: background } : undefined}
        >
            <div className="mx-auto max-w-[1280px]">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="font-inter text-3xl font-semibold" style={{ color: TEXT }}>
                            {title}
                        </h2>
                        <p className="mt-1 font-inter text-sm" style={{ color: TEXT_BODY }}>
                            Top {products.length} products
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to={viewAllTo}
                            className="font-inter text-sm font-medium transition hover:underline"
                            style={{ color: PRIMARY }}
                        >
                            View all
                        </Link>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slidePrev()}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary transition hover:bg-surface-container"
                                aria-label="Previous"
                            >
                                <FiChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slideNext()}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary transition hover:bg-surface-container"
                                aria-label="Next"
                            >
                                <FiChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="product-ranking-carousel mt-10">
                    <Swiper
                        modules={[Pagination]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        spaceBetween={24}
                        slidesPerView={1.15}
                        slidesPerGroup={1}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                slidesPerGroup: 2
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 4
                            }
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="!h-auto">
                                <RankingProductCard product={product} statType={statType} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
