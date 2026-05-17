import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosConfig';
import type { ApiEnvelope } from '../types/api';
import type { ProfileState, ProfileUpdatePayload, ProfileUser } from '../types/profile';

export const fetchUserProfile = createAsyncThunk<
    ProfileUser,
    void,
    { rejectValue: string }
>('profile/fetchUserProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<ApiEnvelope<{ user: ProfileUser }>>('/users/me');
        return response.data.user;
    } catch (error) {
        const msg =
            typeof error === 'string'
                ? error
                : (error as { message?: string })?.message || 'Lỗi khi tải thông tin';
        return rejectWithValue(msg);
    }
});

export const updateUserProfile = createAsyncThunk<
    ProfileUser,
    ProfileUpdatePayload,
    { rejectValue: string }
>('profile/updateUserProfile', async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put<ApiEnvelope<{ user: ProfileUser }>>(
            '/users/profile',
            userData
        );
        return response.data.user;
    } catch (error) {
        const msg =
            typeof error === 'string'
                ? error
                : (error as { message?: string })?.message || 'Cập nhật thất bại';
        return rejectWithValue(msg);
    }
});

const initialState: ProfileState = {
    user: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    updateSuccess: false
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearStatus: (state) => {
            state.error = null;
            state.updateSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.user = action.payload;
                state.updateSuccess = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload ?? null;
                state.updateSuccess = false;
            });
    }
});

export const { clearStatus } = profileSlice.actions;
export default profileSlice.reducer;
