import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, clearStatus } from '../../store/profileSlice';
import InputField from '../common/InputField';
import Button from '../common/Button';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const { user, isUpdating, error, updateSuccess } = useSelector((state) => state.profile);

    // State cục bộ cho Form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    // Cập nhật formData khi có dữ liệu user từ Redux store
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || ''
            });
        }
    }, [user]);

    // Xử lý khi user gõ vào input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (updateSuccess || error) {
            dispatch(clearStatus()); // Xóa thông báo cũ nếu user bắt đầu gõ lại
        }
    };

    // Xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile(formData));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mt-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Chỉnh sửa hồ sơ</h2>
            
            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {updateSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">Cập nhật hồ sơ thành công!</div>}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Họ và tên"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên..."
                    />
                    <InputField
                        label="Email (Không thể thay đổi)"
                        name="email"
                        type="email"
                        value={formData.email}
                        readOnly={true}
                    />
                </div>
                
                <InputField
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại..."
                />
                
                <InputField
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ của bạn..."
                />

                <div className="mt-6 flex justify-end">
                    <Button type="submit" variant="primary" isLoading={isUpdating}>
                        Lưu Thay Đổi
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
