import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    registerUser,
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

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        registerLoading,
        verifyEmailLoading,
        resendOtpLoading,
        error,
        fieldErrors,
        registerSuccess,
        registerInfo,
        verifyEmailSuccess,
        user
    } = useSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [localError, setLocalError] = useState(null);
    const [resendHint, setResendHint] = useState(null);

    const activationEmail = registerInfo?.email ?? '';

    useEffect(() => {
        if (user) {
            navigate('/profile', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearRegisterSuccess());
        };
    }, [dispatch]);

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setResendHint(null);
        if (password !== confirmPassword) {
            setLocalError('Mật khẩu xác nhận không khớp.');
            return;
        }
        await dispatch(
            registerUser({
                username: username.trim(),
                email: email.trim(),
                password
            })
        );
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setResendHint(null);
        const code = digitsOnly(otp);
        if (code.length !== 6) {
            setLocalError('Vui lòng nhập đủ 6 chữ số OTP.');
            return;
        }
        await dispatch(
            verifyRegistrationEmail({
                email: activationEmail,
                otp: code
            })
        );
    };

    const handleResendOtp = async () => {
        setLocalError(null);
        setResendHint(null);
        if (!activationEmail) return;
        try {
            await dispatch(resendRegistrationOtp({ email: activationEmail })).unwrap();
            setResendHint('Đã gửi lại mã OTP. Kiểm tra email (hoặc console nếu bật OTP_DEV_CONSOLE).');
        } catch {
            /* lỗi đã vào Redux error */
        }
    };

    const clearAndType = (setter) => (e) => {
        setter(e.target.value);
        if (error) dispatch(clearAuthError());
        setLocalError(null);
    };

    const handleOtpChange = (e) => {
        setOtp(digitsOnly(e.target.value));
        if (error) dispatch(clearAuthError());
        setLocalError(null);
        setResendHint(null);
    };

    const showOtpStep = registerSuccess && registerInfo && !verifyEmailSuccess;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {verifyEmailSuccess ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Kích hoạt thành công
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Tài khoản đã được xác thực. Bạn có thể đăng nhập ngay.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="primary"
                                className="w-full"
                                onClick={() => navigate('/login', { replace: true })}
                            >
                                Đến trang đăng nhập
                            </Button>
                        </>
                    ) : showOtpStep ? (
                        <>
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Xác thực email
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Nhập mã OTP 6 chữ số đã gửi đến{' '}
                                    <strong className="text-slate-800">{activationEmail}</strong>
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

                            {resendHint && (
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
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Tạo tài khoản UTEShop
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Đăng ký để nhận mã OTP kích hoạt qua email.
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

                            <form onSubmit={handleSubmitRegister} className="space-y-1">
                                <InputField
                                    label="Tên đăng nhập"
                                    name="username"
                                    value={username}
                                    onChange={clearAndType(setUsername)}
                                    placeholder="3–50 ký tự"
                                    error={fieldErrors.username}
                                />
                                <InputField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={clearAndType(setEmail)}
                                    placeholder="you@example.com"
                                    error={fieldErrors.email}
                                />
                                <InputField
                                    label="Mật khẩu"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={clearAndType(setPassword)}
                                    placeholder="Ít nhất 8 ký tự, có chữ và số"
                                    error={fieldErrors.password}
                                />
                                <InputField
                                    label="Xác nhận mật khẩu"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={clearAndType(setConfirmPassword)}
                                    placeholder="Nhập lại mật khẩu"
                                />

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                        isLoading={registerLoading}
                                    >
                                        Đăng ký
                                    </Button>
                                </div>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-600">
                                Đã có tài khoản?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
