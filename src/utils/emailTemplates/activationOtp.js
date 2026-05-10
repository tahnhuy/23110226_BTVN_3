/**
 * HTML + plain text for transactional OTP email (inline styles for client support).
 */
const escapeHtml = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const buildActivationOtpEmail = (otp, ttlMinutes) => {
    const appName = process.env.APP_NAME || 'UTEShop';
    const supportEmail = process.env.MAIL_SUPPORT || process.env.MAIL_USER || '';
    const safeOtp = escapeHtml(otp);
    const year = new Date().getFullYear();

    const text = [
        `${appName} — Mã xác minh tài khoản`,
        '',
        `Mã OTP của bạn: ${otp}`,
        '',
        `Mã có hiệu lực trong ${ttlMinutes} phút. Không chia sẻ mã này với bất kỳ ai.`,
        '',
        'Nếu bạn không yêu cầu mã này, hãy bỏ qua email hoặc liên hệ hỗ trợ nếu bạn lo ngại về bảo mật tài khoản.',
        supportEmail ? `Hỗ trợ: ${supportEmail}` : '',
        '',
        `© ${year} ${appName}`
    ]
        .filter(Boolean)
        .join('\n');

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã xác minh</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">Mã ${safeOtp} — có hiệu lực ${ttlMinutes} phút.</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0;font-size:20px;font-weight:600;color:#111827;letter-spacing:-0.02em;">${escapeHtml(
                  appName
              )}</p>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.5;color:#4b5563;">Xin chào,</p>
              <p style="margin:8px 0 0 0;font-size:15px;line-height:1.6;color:#374151;">Dưới đây là mã xác minh để hoàn tất đăng ký tài khoản của bạn.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 32px 24px 32px;">
              <div style="display:inline-block;padding:16px 28px;background:linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%);border:1px solid #e5e7eb;border-radius:10px;">
                <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#6b7280;">Mã OTP</p>
                <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#111827;font-family:ui-monospace,'Cascadia Code','SF Mono',Menlo,monospace;">${safeOtp}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">Mã có hiệu lực trong <strong style="color:#374151;">${ttlMinutes} phút</strong>. Không gửi mã này qua tin nhắn, email lạ hoặc mạng xã hội.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:20px 0 0 0;font-size:13px;line-height:1.5;color:#9ca3af;">Bạn không thực hiện yêu cầu này? Có thể bỏ qua email này. Nếu nghi ngờ truy cập trái phép, hãy đổi mật khẩu sau khi đăng nhập.</p>
              ${
                  supportEmail
                      ? `<p style="margin:12px 0 0 0;font-size:13px;color:#9ca3af;">Liên hệ: <a href="mailto:${escapeHtml(
                            supportEmail
                        )}" style="color:#2563eb;text-decoration:none;">${escapeHtml(supportEmail)}</a></p>`
                      : ''
              }
              <p style="margin:16px 0 0 0;font-size:12px;color:#d1d5db;">© ${year} ${escapeHtml(appName)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const subject = `${appName} — Mã xác minh tài khoản`;

    return { subject, text, html };
};

module.exports = { buildActivationOtpEmail };
