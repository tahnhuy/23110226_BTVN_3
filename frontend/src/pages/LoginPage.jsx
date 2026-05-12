import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/authSlice';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/profile';
    const justActivated = location.state?.justActivated === true;

    const { loginLoading, error, fieldErrors, user } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        const result = await dispatch(loginUser({ email: trimmedEmail, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate(from, { replace: true });
            return;
        }
        if (loginUser.rejected.match(result)) {
            const p = result.payload;
            const isInactive =
                p?.code === 'ACCOUNT_INACTIVE' ||
                (typeof p?.message === 'string' && p.message.includes('chưa kích hoạt'));
            if (isInactive) {
                dispatch(clearAuthError());
                navigate('/activate', {
                    replace: true,
                    state: { email: trimmedEmail, fromLoginAt: Date.now() }
                });
            }
        }
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
        if (error) dispatch(clearAuthError());
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        if (error) dispatch(clearAuthError());
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Đăng nhập UTEShop
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Nhập email và mật khẩu để tiếp tục.
                        </p>
                    </div>

                    {justActivated && (
                        <div
                            className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-100"
                            role="status"
                        >
                            Tài khoản đã được kích hoạt. Bạn có thể đăng nhập.
                        </div>
                    )}

                    {error && (
                        <div
                            className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-1">
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChangeEmail}
                            placeholder="you@example.com"
                            error={fieldErrors.email}
                        />
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChangePassword}
                            placeholder="••••••••"
                            error={fieldErrors.password}
                        />

                        <div className="flex justify-end pt-1">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={loginLoading}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
