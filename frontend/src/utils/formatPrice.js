export function formatPrice(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(n);
}
