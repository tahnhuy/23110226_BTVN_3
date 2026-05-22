import type { TrackingStep } from '../utils/orderStatus';

export interface ShippingInfo {
    recipientName: string;
    phone: string;
    line1: string;
    line2?: string;
    ward?: string;
    district?: string;
    city: string;
}

export interface CheckoutPayload {
    paymentMethod: 'cod';
    shipping: ShippingInfo;
    note?: string;
}

export interface OrderPayment {
    id?: number;
    method: string;
    status: string;
    amount: number;
}

export interface OrderItemRow {
    id: number;
    productId: number;
    variantId: number | null;
    productName: string;
    sku: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface OrderTrackingMeta {
    statusLabel: string;
    trackingSteps: TrackingStep[];
    currentStepIndex: number;
    cancellationRequested: boolean;
    cancellationRequestedAt: string | null;
    customerCancelReason: string | null;
    canCancelDirect: boolean;
    canRequestCancel: boolean;
    cancelWindowEndsAt: string;
    autoConfirmAt: string;
    minutesUntilAutoConfirm: number | null;
    cancelWindowMinutes: number;
    autoConfirmMinutes: number;
}

export interface OrderDetail extends OrderTrackingMeta {
    id: number;
    orderNumber: string;
    status: string;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    total: number;
    note: string | null;
    shippingSnapshot: ShippingInfo;
    placedAt: string | null;
    createdAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    items: OrderItemRow[];
    payment: OrderPayment | null;
}

export interface CheckoutInfo {
    paymentMethods: Array<{ code: string; name: string; description: string }>;
    shippingFee: number;
    codOnly: boolean;
}

export interface OrderListItem {
    id: number;
    orderNumber: string;
    status: string;
    statusLabel: string;
    currentStepIndex: number;
    cancellationRequested: boolean;
    total: number;
    placedAt: string | null;
    createdAt: string;
    itemCount: number;
    previewProductName: string | null;
    payment: { method: string; status: string; amount: number } | null;
}

export interface OrdersListResponse {
    orders: OrderListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
