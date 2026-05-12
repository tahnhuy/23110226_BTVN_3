import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosConfig';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_USER_KEY = 'authUser';

function loadStoredUser() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function persistAuthSession({ accessToken, refreshToken, user }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearStoredSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

function parseApiError(payload) {
    if (!payload) return 'Đã xảy ra lỗi';
    if (typeof payload === 'string') return payload;
    if (payload.message) return payload.message;
    return 'Đã xảy ra lỗi';
}

function mapValidationErrors(errors) {
    if (!Array.isArray(errors)) return {};
    return errors.reduce((acc, e) => {
        const key = e.path ?? e.param;
        if (key && acc[key] == null) acc[key] = e.msg;
        return acc;
    }, {});
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/register', { username, email, password });
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/** Kích hoạt tài khoản sau đăng ký — POST /auth/verify-email */
export const verifyRegistrationEmail = createAsyncThunk(
    'auth/verifyRegistrationEmail',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/verify-email', { email, otp });
            return res?.data ?? res;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

/** Gửi lại OTP đăng ký — POST /auth/resend-otp */
export const resendRegistrationOtp = createAsyncThunk(
    'auth/resendRegistrationOtp',
    async ({ email }, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/resend-otp', { email });
            return { email };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const forgotPasswordUser = createAsyncThunk(
    'auth/forgotPasswordUser',
    async ({ email }, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            return { email };
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const resetPasswordUser = createAsyncThunk(
    'auth/resetPasswordUser',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const initialState = {
    user: loadStoredUser(),
    loginLoading: false,
    registerLoading: false,
    verifyEmailLoading: false,
    resendOtpLoading: false,
    forgotPasswordLoading: false,
    resetPasswordLoading: false,
    error: null,
    fieldErrors: {},
    registerSuccess: false,
    registerInfo: null,
    verifyEmailSuccess: false,
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.fieldErrors = {};
            state.registerSuccess = false;
            state.registerInfo = null;
            state.verifyEmailSuccess = false;
            clearStoredSession();
        },
        clearAuthError: (state) => {
            state.error = null;
            state.fieldErrors = {};
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false;
            state.registerInfo = null;
            state.verifyEmailSuccess = false;
        },
        clearResetPasswordSuccess: (state) => {
            state.forgotPasswordSuccess = false;
            state.resetPasswordSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
                state.fieldErrors = {};
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginLoading = false;
                const { accessToken, refreshToken, user } = action.payload;
                state.user = user;
                persistAuthSession({ accessToken, refreshToken, user });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginLoading = false;
                const p = action.payload;
                const inactive =
                    p?.code === 'ACCOUNT_INACTIVE' ||
                    (typeof p?.message === 'string' && p.message.includes('chưa kích hoạt'));
                if (inactive) {
                    state.error = null;
                    state.fieldErrors = {};
                    return;
                }
                state.error = parseApiError(p);
                state.fieldErrors = mapValidationErrors(p?.errors);
            })
            .addCase(registerUser.pending, (state) => {
                state.registerLoading = true;
                state.error = null;
                state.fieldErrors = {};
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerLoading = false;
                state.registerSuccess = true;
                state.registerInfo = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerLoading = false;
                const p = action.payload;
                state.error = parseApiError(p);
                state.fieldErrors = mapValidationErrors(p?.errors);
            })
            .addCase(verifyRegistrationEmail.pending, (state) => {
                state.verifyEmailLoading = true;
                state.error = null;
                state.fieldErrors = {};
            })
            .addCase(verifyRegistrationEmail.fulfilled, (state) => {
                state.verifyEmailLoading = false;
                state.verifyEmailSuccess = true;
                state.registerSuccess = false;
                state.registerInfo = null;
                state.error = null;
            })
            .addCase(verifyRegistrationEmail.rejected, (state, action) => {
                state.verifyEmailLoading = false;
                const p = action.payload;
                state.error = parseApiError(p);
                state.fieldErrors = mapValidationErrors(p?.errors);
            })
            .addCase(resendRegistrationOtp.pending, (state) => {
                state.resendOtpLoading = true;
                state.error = null;
            })
            .addCase(resendRegistrationOtp.fulfilled, (state) => {
                state.resendOtpLoading = false;
                state.error = null;
            })
            .addCase(resendRegistrationOtp.rejected, (state, action) => {
                state.resendOtpLoading = false;
                const p = action.payload;
                state.error = parseApiError(p);
            })
            .addCase(forgotPasswordUser.pending, (state) => {
                state.forgotPasswordLoading = true;
                state.error = null;
                state.forgotPasswordSuccess = false;
            })
            .addCase(forgotPasswordUser.fulfilled, (state) => {
                state.forgotPasswordLoading = false;
                state.forgotPasswordSuccess = true;
                state.error = null;
            })
            .addCase(forgotPasswordUser.rejected, (state, action) => {
                state.forgotPasswordLoading = false;
                const p = action.payload;
                state.error = parseApiError(p);
                state.fieldErrors = mapValidationErrors(p?.errors);
            })
            .addCase(resetPasswordUser.pending, (state) => {
                state.resetPasswordLoading = true;
                state.error = null;
                state.resetPasswordSuccess = false;
            })
            .addCase(resetPasswordUser.fulfilled, (state) => {
                state.resetPasswordLoading = false;
                state.resetPasswordSuccess = true;
                state.error = null;
            })
            .addCase(resetPasswordUser.rejected, (state, action) => {
                state.resetPasswordLoading = false;
                const p = action.payload;
                state.error = parseApiError(p);
                state.fieldErrors = mapValidationErrors(p?.errors);
            });
    }
});

export const { logout, clearAuthError, clearRegisterSuccess, clearResetPasswordSuccess } = authSlice.actions;
export default authSlice.reducer;
