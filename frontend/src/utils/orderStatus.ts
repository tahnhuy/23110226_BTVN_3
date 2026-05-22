export type OrderStatusKey =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipping'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface TrackingStep {
    key: string;
    label: string;
    description: string;
    state: 'completed' | 'current' | 'upcoming' | 'cancelled' | 'warning';
}

export const STATUS_BADGE_CLASS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-900',
    confirmed: 'bg-blue-100 text-blue-900',
    processing: 'bg-indigo-100 text-indigo-900',
    shipping: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    delivered: 'bg-green-100 text-green-900',
    cancelled: 'bg-surface-container-highest text-on-surface-variant',
    refunded: 'bg-surface-container-highest text-on-surface-variant'
};

export function formatOrderDate(iso: string | null | undefined) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
