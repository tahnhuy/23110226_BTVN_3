import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    verifyRegistrationEmail,
    resendRegistrationOtp,
    clearAuthError,
    clearRegisterSuccess
} from '../store/authSlice';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

function digitsOnly(value) {
    return String(value ?? '').replace(/\D/g, '').slice(0, 6);
}

/** Tránh gửi OTP tự động trùng (React StrictMode chạy effect 2 lần ở dev). */
const activationAutoResendKeys = new Set();

/**
 * Kích hoạt tài khoản khi đăng nhập bị từ chối do chưa active.
 * Vào trang từ /login (state.email); tự gửi OTP mới một lần khi có fromLoginAt.
 */
const ActivateAccountPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = typeof location.state?.email === 'string' ? location.state.email.trim() : '';
    const fromLoginAt = location.state?.fromLoginAt;

    const { verifyEmailLoading, resendOtpLoading, error, fieldErrors, user } = useSelector(
        (state) => state.auth
    );

    const [otp, setOtp] = useState('');
    const [localError, setLocalError] = useState(null);
    const [resendHint, setResendHint] = useState(null);

    useEffect(() => {
        if (user) {
            navigate('/profile', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!email || !fromLoginAt) return;
        const dedupeKey = `${email}|${fromLoginAt}`;
        if (activationAutoResendKeys.has(dedupeKey)) return;
        activationAutoResendKeys.add(dedupeKey);

        dispatch(resendRegistrationOtp({ email }))
            .unwrap()
            .then(() => {
                setResendHint(
                    'Đã gửi mã OTP mới đến email của bạn. Kiểm tra hộp thư (hoặc console nếu bật OTP_DEV_CONSOLE).'
                );
            })
            .catch(() => {
                /* lỗi hiển thị qua Redux error */
            });
    }, [email, fromLoginAt, dispatch]);

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setResendHint(null);
        const code = digitsOnly(otp);
        if (code.length !== 6) {
            setLocalError('Vui lòng nhập đủ 6 chữ số OTP.');
            return;
        }
        const result = await dispatch(verifyRegistrationEmail({ email, otp: code }));
        if (verifyRegistrationEmail.fulfilled.match(result)) {
            dispatch(clearRegisterSuccess());
            navigate('/login', { replace: true, state: { justActivated: true } });
        }
    };

    const handleResendOtp = async () => {
        setLocalError(null);
        setResendHint(null);
        try {
            await dispatch(resendRegistrationOtp({ email })).unwrap();
            setResendHint('Đã gửi lại mã OTP. Kiểm tra email.');
        } catch {
            /* lỗi trong Redux */
        }
    };

    const handleOtpChange = (e) => {
        setOtp(digitsOnly(e.target.value));
        if (error) dispatch(clearAuthError());
        setLocalError(null);
        setResendHint(null);
    };

    if (!email) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Kích hoạt tài khoản
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Tài khoản <strong className="text-slate-800">{email}</strong> chưa được kích hoạt.
                            {fromLoginAt
                                ? ' Mã OTP mới đã được gửi khi bạn vào trang này từ đăng nhập.'
                                : ' Nhấn «Gửi lại mã OTP» để nhận mã qua email.'}
                        </p>
                    </div>

                    {(error || localError) && (
                        <div
                            className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100"
                            role="alert"
                        >
                            {localError || error}
                        </div>
                    )}

                    {resendHint && !error && !localError && (
                        <div
                            className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-sm border border-blue-100"
                            role="status"
                        >
                            {resendHint}
                        </div>
                    )}

                    <form onSubmit={handleSubmitOtp} className="space-y-1">
                        <InputField
                            label="Mã OTP"
                            name="otp"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="000000"
                            error={fieldErrors.otp}
                        />

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={verifyEmailLoading}
                            >
                                Xác nhận kích hoạt
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleResendOtp}
                                isLoading={resendOtpLoading}
                                disabled={verifyEmailLoading}
                            >
                                Gửi lại mã OTP
                            </Button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ActivateAccountPage;
