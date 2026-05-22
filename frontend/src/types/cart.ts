export interface CartProductInfo {
    id: number;
    name: string;
    slug: string;
    price: number | null;
    stockQuantity: number;
    status: string;
    imageUrl: string | null;
}

export interface CartVariantInfo {
    id: number;
    name: string;
    price: number | null;
    stockQuantity: number;
}

export interface CartItemLine {
    id: number;
    productId: number;
    variantId: number | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    isSelected: boolean;
    product: CartProductInfo;
    variant: CartVariantInfo | null;
}

export interface CartSummary {
    itemCount: number;
    subtotal: number;
    selectedItemCount: number;
    selectedSubtotal: number;
    allSelected: boolean;
}

export interface CartData {
    cart: { id: number; status: string };
    items: CartItemLine[];
    summary: CartSummary;
}

export interface CartState {
    items: CartItemLine[];
    summary: CartSummary;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    addLoading: boolean;
    updateLoadingId: number | null;
    removeLoadingId: number | null;
    selectLoadingId: number | null;
    selectAllLoading: boolean;
    error: string | null;
}
