/**
 * Chuẩn hóa OTP để so khớp Redis: bỏ khoảng trắng/ký tự ẩn, chuyển số fullwidth (tiếng Nhật/Trung) → ASCII.
 * Tránh lỗi "Sai mã OTP" khi copy từ HTML email.
 */
const normalizeOtpDigits = (input) => {
    if (input == null || input === '') return '';
    const s = String(input).normalize('NFKC').trim();
    return s.replace(/\D/g, '');
};

module.exports = { normalizeOtpDigits };
