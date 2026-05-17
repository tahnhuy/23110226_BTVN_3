const CART_KEY = 'uteshop_cart';

export interface CartLine {
    productId: number;
    slug: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
}

function readCart(): CartLine[] {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
        return [];
    }
}

function writeCart(items: CartLine[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(line: Omit<CartLine, 'quantity'> & { quantity: number }) {
    const items = readCart();
    const idx = items.findIndex((i) => i.productId === line.productId);
    if (idx >= 0) {
        items[idx].quantity += line.quantity;
    } else {
        items.push({ ...line });
    }
    writeCart(items);
    return items;
}

export function getCartCount(): number {
    return readCart().reduce((sum, i) => sum + i.quantity, 0);
}
