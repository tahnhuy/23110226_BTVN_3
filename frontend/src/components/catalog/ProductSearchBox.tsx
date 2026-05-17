import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import { formatPrice } from '../../utils/formatPrice';
import type { ApiEnvelope } from '../../types/api';
import type { CatalogProduct } from '../../types/catalog';

const DEBOUNCE_MS = 280;
const MIN_CHARS = 2;
const SUGGEST_LIMIT = 8;

interface ProductSearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (term: string) => void;
    category?: string;
    majorId?: string | number;
    placeholder?: string;
}

interface ProductsListData {
    products: CatalogProduct[];
}

export default function ProductSearchBox({
    value,
    onChange,
    onSearch,
    category,
    majorId,
    placeholder = 'Search products, SKU, keywords…'
}: ProductSearchBoxProps) {
    const navigate = useNavigate();
    const listId = useId();
    const wrapperRef = useRef<HTMLFormElement>(null);
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
    const [suggestLoading, setSuggestLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const term = value.trim();
        if (term.length < MIN_CHARS) {
            setSuggestions([]);
            setSuggestLoading(false);
            setOpen(false);
            setActiveIndex(-1);
            return undefined;
        }

        setOpen(true);
        setSuggestLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await axiosInstance.get<ApiEnvelope<ProductsListData>>(
                    '/catalog/products',
                    {
                        params: {
                            q: term,
                            category: category && category !== 'all' ? category : undefined,
                            majorId: majorId || undefined,
                            limit: SUGGEST_LIMIT,
                            page: 1,
                            sort: 'popular'
                        }
                    }
                );
                setSuggestions(res.data?.products ?? []);
                setActiveIndex(-1);
            } catch {
                setSuggestions([]);
            } finally {
                setSuggestLoading(false);
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [value, category, majorId]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const goToProduct = (product: CatalogProduct) => {
        onChange(product.name);
        setOpen(false);
        setActiveIndex(-1);
        navigate(`/products/${product.slug}`);
    };

    const applySearch = (term: string) => {
        const t = term.trim();
        onChange(t);
        onSearch(t);
        setOpen(false);
        setActiveIndex(-1);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
            goToProduct(suggestions[activeIndex]);
            return;
        }
        applySearch(value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!open || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    const showDropdown = open && value.trim().length >= MIN_CHARS;

    return (
        <form onSubmit={handleSubmit} className="relative flex-1" ref={wrapperRef}>
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-on-surface-variant">
                search
            </span>
            <input
                type="search"
                role="combobox"
                aria-expanded={showDropdown}
                aria-controls={listId}
                aria-autocomplete="list"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    if (e.target.value.trim().length >= MIN_CHARS) setOpen(true);
                }}
                onFocus={() => {
                    if (value.trim().length >= MIN_CHARS) setOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className="h-12 w-full rounded-full border-none bg-surface-container pl-12 pr-4 text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20"
            />

            {showDropdown && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[360px] overflow-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest py-2 soft-shadow"
                >
                    {suggestLoading && (
                        <li className="px-4 py-3 text-sm text-on-surface-variant">Searching…</li>
                    )}
                    {!suggestLoading && suggestions.length === 0 && (
                        <li className="px-4 py-3 text-sm text-on-surface-variant">
                            No products found
                        </li>
                    )}
                    {!suggestLoading &&
                        suggestions.map((product, index) => (
                            <li key={product.id} role="option" aria-selected={index === activeIndex}>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => goToProduct(product)}
                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                        index === activeIndex
                                            ? 'bg-primary/10'
                                            : 'hover:bg-surface-container'
                                    }`}
                                >
                                    <img
                                        src={product.imageUrl || '/PremiumLaptop.png'}
                                        alt=""
                                        className="h-11 w-11 shrink-0 rounded-lg object-cover bg-surface-container"
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-on-surface">
                                            {product.name}
                                        </span>
                                        {product.shortDescription && (
                                            <span className="block truncate text-xs text-on-surface-variant">
                                                {product.shortDescription}
                                            </span>
                                        )}
                                    </span>
                                    <span className="shrink-0 text-sm font-semibold text-primary">
                                        {formatPrice(product.price)}
                                    </span>
                                </button>
                            </li>
                        ))}
                    {!suggestLoading && suggestions.length > 0 && (
                        <li className="border-t border-outline-variant/20 px-4 py-2">
                            <button
                                type="submit"
                                className="w-full text-left text-xs font-semibold text-primary hover:underline"
                            >
                                View all results for &quot;{value.trim()}&quot;
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </form>
    );
}
