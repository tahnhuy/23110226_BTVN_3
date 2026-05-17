export interface AuthUser {
    id: number;
    username: string;
    email: string;
    role: string;
    status?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
}

export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
    redirectUrl?: string;
}

export interface RegisterInfo {
    userId?: number;
    email: string;
}

export interface AuthState {
    user: AuthUser | null;
    loginLoading: boolean;
    registerLoading: boolean;
    verifyEmailLoading: boolean;
    resendOtpLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
    registerSuccess: boolean;
    registerInfo: RegisterInfo | null;
    verifyEmailSuccess: boolean;
}
