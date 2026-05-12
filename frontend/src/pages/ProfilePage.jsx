import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/profileSlice';
import ProfileForm from '../components/profile/ProfileForm';
// Import react-icons (Giả sử bạn cần icon user mặc định)
import { FaUserCircle } from 'react-icons/fa';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.profile);

    useEffect(() => {
        // Fetch dữ liệu ngay khi mount Component
        dispatch(fetchUserProfile());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trang Cá Nhân</h1>
                    <p className="mt-2 text-sm text-gray-600">Quản lý thông tin và bảo mật tài khoản của bạn.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <>
                        {error && !user ? (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center shadow-sm">
                                <p>Đã xảy ra lỗi: {error}</p>
                                <p className="text-sm mt-2">(Mẹo: API Backend hiện chưa có dữ liệu thật hoặc bạn chưa đăng nhập)</p>
                            </div>
                        ) : (
                            <div>
                                {/* Khối hiển thị Avatar dạng tĩnh để minh họa */}
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center relative max-w-2xl mx-auto">
                                    <FaUserCircle className="text-gray-300 w-24 h-24 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">{user?.fullName || 'Người dùng ẩn danh'}</h3>
                                    <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full mt-2">
                                        {user?.role || 'Thành viên'}
                                    </span>
                                </div>

                                {/* Form cập nhật */}
                                <ProfileForm />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
