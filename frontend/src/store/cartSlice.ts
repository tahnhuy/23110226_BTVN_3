import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosConfig';
import { logout } from './authSlice';
import type { ApiEnvelope } from '../types/api';
import type { CartData, CartState } from '../types/cart';

function parseError(error: unknown): string {
    if (typeof error === 'string') return error;
    const p = error as { message?: string };
    return p?.message || 'Đã xảy ra lỗi';
}

const emptySummary: CartState['summary'] = {
    itemCount: 0,
    subtotal: 0,
    selectedItemCount: 0,
    selectedSubtotal: 0,
    allSelected: false
};

export const fetchCart = createAsyncThunk<CartData, void, { rejectValue: string }>(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ApiEnvelope<CartData>>('/cart');
            return response.data;
        } catch (error) {
            return rejectWithValue(parseError(error));
        }
    }
);

export const addToCart = createAsyncThunk<
    CartData,
    { productId: number; quantity: number; variantId?: number },
    { rejectValue: string }
>('cart/addToCart', async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post<ApiEnvelope<CartData>>('/cart/items', payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const updateCartItem = createAsyncThunk<
    CartData,
    { itemId: number; quantity: number },
    { rejectValue: string }
>('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch<ApiEnvelope<CartData>>(
            `/cart/items/${itemId}`,
            { quantity }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const setCartItemSelected = createAsyncThunk<
    CartData,
    { itemId: number; isSelected: boolean },
    { rejectValue: string }
>('cart/setCartItemSelected', async ({ itemId, isSelected }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch<ApiEnvelope<CartData>>(
            `/cart/items/${itemId}/select`,
            { isSelected }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const setCartSelectionAll = createAsyncThunk<
    CartData,
    { isSelected: boolean },
    { rejectValue: string }
>('cart/setCartSelectionAll', async ({ isSelected }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch<ApiEnvelope<CartData>>('/cart/selection', {
            isSelected
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
});

export const removeCartItem = createAsyncThunk<CartData, number, { rejectValue: string }>(
    'cart/removeCartItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete<ApiEnvelope<CartData>>(
                `/cart/items/${itemId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(parseError(error));
        }
    }
);

const initialState: CartState = {
    items: [],
    summary: emptySummary,
    status: 'idle',
    addLoading: false,
    updateLoadingId: null,
    removeLoadingId: null,
    selectLoadingId: null,
    selectAllLoading: false,
    error: null
};

function applyCartData(state: CartState, data: CartData) {
    state.items = data.items;
    state.summary = data.summary;
    state.status = 'succeeded';
    state.error = null;
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.summary = emptySummary;
            state.status = 'idle';
            state.addLoading = false;
            state.updateLoadingId = null;
            state.removeLoadingId = null;
            state.selectLoadingId = null;
            state.selectAllLoading = false;
            state.error = null;
        },
        clearCartError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                applyCartData(state, action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? null;
            })
            .addCase(addToCart.pending, (state) => {
                state.addLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.addLoading = false;
                applyCartData(state, action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(updateCartItem.pending, (state, action) => {
                state.updateLoadingId = action.meta.arg.itemId;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.updateLoadingId = null;
                applyCartData(state, action.payload);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.updateLoadingId = null;
                state.error = action.payload ?? null;
            })
            .addCase(removeCartItem.pending, (state, action) => {
                state.removeLoadingId = action.meta.arg;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.removeLoadingId = null;
                applyCartData(state, action.payload);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.removeLoadingId = null;
                state.error = action.payload ?? null;
            })
            .addCase(setCartItemSelected.pending, (state, action) => {
                state.selectLoadingId = action.meta.arg.itemId;
                state.error = null;
            })
            .addCase(setCartItemSelected.fulfilled, (state, action) => {
                state.selectLoadingId = null;
                applyCartData(state, action.payload);
            })
            .addCase(setCartItemSelected.rejected, (state, action) => {
                state.selectLoadingId = null;
                state.error = action.payload ?? null;
            })
            .addCase(setCartSelectionAll.pending, (state) => {
                state.selectAllLoading = true;
                state.error = null;
            })
            .addCase(setCartSelectionAll.fulfilled, (state, action) => {
                state.selectAllLoading = false;
                applyCartData(state, action.payload);
            })
            .addCase(setCartSelectionAll.rejected, (state, action) => {
                state.selectAllLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(logout, (state) => {
                state.items = [];
                state.summary = emptySummary;
                state.status = 'idle';
                state.addLoading = false;
                state.updateLoadingId = null;
                state.removeLoadingId = null;
                state.selectLoadingId = null;
                state.selectAllLoading = false;
                state.error = null;
            });
    }
});

export const { clearCartState, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
