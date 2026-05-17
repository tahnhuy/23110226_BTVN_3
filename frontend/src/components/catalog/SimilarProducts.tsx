import { Link } from 'react-router-dom';
import type { CatalogProduct } from '../../types/catalog';
import { formatPrice } from '../../utils/formatPrice';

interface SimilarProductsProps {
    products: CatalogProduct[];
    categoryName?: string | null;
}

function categoryLabel(product: CatalogProduct) {
    const c = product.category;
    if (!c) return 'General';
    if (c.parentName) return `${c.parentName} · ${c.name}`;
    return c.name;
}

export default function SimilarProducts({ products, categoryName }: SimilarProductsProps) {
    if (products.length === 0) return null;

    return (
        <section className="mt-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-on-surface">Similar Products</h2>
                    <p className="mt-2 text-on-surface-variant">
                        {categoryName
                            ? `More items in ${categoryName}`
                            : 'You might also like these products'}
                    </p>
                </div>
                <Link
                    to="/categories"
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    View all
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="group cursor-pointer"
                    >
                        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[24px] bg-surface-container-low transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                            <img
                                src={product.imageUrl || '/PremiumLaptop.png'}
                                alt={product.imageAlt || product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {product.isFeatured && (
                                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                                    Popular
                                </span>
                            )}
                        </div>
                        <h3 className="mb-1 text-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
                            {product.name}
                        </h3>
                        <p className="mb-2 text-xs text-on-surface-variant">{categoryLabel(product)}</p>
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xl font-semibold text-on-surface">
                                {formatPrice(product.price)}
                            </span>
                            {(product.soldCount ?? 0) > 0 && (
                                <span className="text-xs text-on-surface-variant">
                                    {product.soldCount} sold
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
