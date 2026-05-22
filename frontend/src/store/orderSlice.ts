import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosConfig';
import type { ApiEnvelope } from '../types/api';
import type {
    CheckoutInfo,
    CheckoutPayload,
    OrderDetail,
    OrderListItem,
    OrdersListResponse
} from '../types/order';

function parseError(error: unknown): string {
    if (typeof error === 'string') return error;
    const p = error as { message?: string };
    return p?.message || 'Đã xảy ra lỗi';
}

export const fetchCheckoutInfo = createAsyncThunk<CheckoutInfo, void, { rejectValue: string }>(
    'order/fetchCheckoutInfo',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<ApiEnvelope<CheckoutInfo>>('/orders/checkout-info');
            return res.data;
        } catch (error) {
            return rejectWithValue(parseError(error));
        }
    }
);

export const fetchOrders = createAsyncThunk<
    OrdersListResponse,
    { page?: number; limit?: number } | void,
    { rejectValue: string }
>('order/fetchOrders', async (params, { rejectWithValue }) => {
    try {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const res = await axiosInstance.get<ApiEnvelope<OrdersListResponse>>(
            `/orders?page=${page}&limit=${limit}`
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const placeOrder = createAsyncThunk<
    OrderDetail,
    CheckoutPayload,
    { rejectValue: string }
>('order/placeOrder', async (payload, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post<ApiEnvelope<{ order: OrderDetail }>>(
            '/orders/checkout',
            payload
        );
        return res.data.order;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const fetchOrderByNumber = createAsyncThunk<
    OrderDetail,
    string,
    { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get<ApiEnvelope<{ order: OrderDetail }>>(
            `/orders/${encodeURIComponent(orderNumber)}`
        );
        return res.data.order;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const cancelOrder = createAsyncThunk<
    OrderDetail,
    { orderNumber: string; reason?: string },
    { rejectValue: string }
>('order/cancelOrder', async ({ orderNumber, reason }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post<ApiEnvelope<{ order: OrderDetail }>>(
            `/orders/${encodeURIComponent(orderNumber)}/cancel`,
            { reason }
        );
        return res.data.order;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

interface OrderState {
    checkoutInfo: CheckoutInfo | null;
    lastOrder: OrderDetail | null;
    orders: OrderListItem[];
    pagination: OrdersListResponse['pagination'] | null;
    placing: boolean;
    loading: boolean;
    listLoading: boolean;
    cancelling: boolean;
    error: string | null;
}

const initialState: OrderState = {
    checkoutInfo: null,
    lastOrder: null,
    orders: [],
    pagination: null,
    placing: false,
    loading: false,
    listLoading: false,
    cancelling: false,
    error: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },
        clearLastOrder: (state) => {
            state.lastOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCheckoutInfo.fulfilled, (state, action) => {
                state.checkoutInfo = action.payload;
            })
            .addCase(fetchOrders.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.listLoading = false;
                state.orders = action.payload.orders;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.listLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(placeOrder.pending, (state) => {
                state.placing = true;
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.placing = false;
                state.lastOrder = action.payload;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.placing = false;
                state.error = action.payload ?? null;
            })
            .addCase(fetchOrderByNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.lastOrder = action.payload;
            })
            .addCase(fetchOrderByNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.cancelling = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelling = false;
                state.lastOrder = action.payload;
                const idx = state.orders.findIndex(
                    (o) => o.orderNumber === action.payload.orderNumber
                );
                if (idx >= 0) {
                    state.orders[idx] = {
                        ...state.orders[idx],
                        status: action.payload.status,
                        statusLabel: action.payload.statusLabel,
                        cancellationRequested: action.payload.cancellationRequested,
                        currentStepIndex: action.payload.currentStepIndex
                    };
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelling = false;
                state.error = action.payload ?? null;
            });
    }
});

export const { clearOrderError, clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
