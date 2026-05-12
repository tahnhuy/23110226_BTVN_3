import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordUser, resetPasswordUser, clearAuthError, clearResetPasswordSuccess } from '../../store/authSlice';
import InputField from '../common/InputField';
import Button from '../common/Button';

const ResetPasswordForm = ({ email }) => {
    const dispatch = useDispatch();
    const { 
        forgotPasswordLoading, 
        resetPasswordLoading, 
        forgotPasswordSuccess, 
        resetPasswordSuccess, 
        error 
    } = useSelector(state => state.auth);

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    // State cho việc đếm ngược (cooldown timer)
    const [cooldown, setCooldown] = useState(0);

    // Kích hoạt useEffect đếm ngược khi cooldown > 0
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldown]);

    // Cleanup khi unmount Component (chuyển tab)
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
            dispatch(clearResetPasswordSuccess());
        };
    }, [dispatch]);

    const handleSendOtp = () => {
        if (!email) {
            setLocalError("Không tìm thấy email của bạn.");
            return;
        }
        setLocalError('');
        dispatch(forgotPasswordUser({ email }));
        setCooldown(60); // Bắt đầu đếm ngược 60s
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setLocalError('');
        
        if (!otp || !newPassword || !confirmPassword) {
            setLocalError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setLocalError("Mật khẩu xác nhận không khớp.");
            return;
        }
        
        dispatch(resetPasswordUser({ email, otp, newPassword }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mt-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Đổi Mật Khẩu</h2>
            
            {(error || localError) && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {localError || error}
                </div>
            )}
            
            {resetPasswordSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    Đổi mật khẩu thành công! Mật khẩu mới của bạn đã được cập nhật.
                </div>
            )}

            {!forgotPasswordSuccess && !resetPasswordSuccess && (
                <div className="mb-6">
                    <p className="text-gray-600 mb-4 text-sm">
                        Hệ thống sẽ gửi một mã OTP gồm 6 chữ số đến email <span className="font-semibold text-gray-800">{email || 'của bạn'}</span> để xác nhận yêu cầu đổi mật khẩu.
                    </p>
                    <Button 
                        onClick={handleSendOtp} 
                        isLoading={forgotPasswordLoading}
                        disabled={cooldown > 0}
                        variant="secondary"
                    >
                        {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi mã xác nhận (OTP)'}
                    </Button>
                </div>
            )}

            {forgotPasswordSuccess && !resetPasswordSuccess && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                        Mã xác nhận đã được gửi! Vui lòng kiểm tra email của bạn.
                        <div className="mt-2">
                            <button 
                                type="button" 
                                onClick={handleSendOtp}
                                disabled={cooldown > 0}
                                className={`text-blue-600 underline text-xs font-semibold ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-800'}`}
                            >
                                {cooldown > 0 ? `Chờ ${cooldown}s để gửi lại` : 'Gửi lại mã'}
                            </button>
                        </div>
                    </div>

                    <InputField
                        label="Mã OTP (6 chữ số)"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập mã OTP..."
                    />
                    
                    <InputField
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới..."
                    />
                    
                    <InputField
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu..."
                    />

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" variant="primary" isLoading={resetPasswordLoading}>
                            Xác nhận đổi mật khẩu
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordForm;
