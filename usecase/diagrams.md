# UML Diagrams for UTEShop (Auth & Profile)

## 1. Use Case Diagram: Quên Mật Khẩu
Biểu đồ này tập trung riêng vào tính năng khôi phục mật khẩu dành cho người dùng chưa đăng nhập.

```mermaid
usecaseDiagram
    actor "Người dùng (Khách)" as User
    
    package "Hệ thống Quên Mật Khẩu" {
        usecase "Yêu cầu khôi phục mật khẩu" as UC1
        usecase "Đặt lại mật khẩu mới" as UC2
        usecase "Hệ thống gửi Email OTP" as UC_Email
    }
    
    User --> UC1
    User --> UC2
    
    UC1 ..> UC_Email : <<include>>
```

## 2. Use Case Diagram: Cập nhật Profile
Biểu đồ này tập trung vào tính năng chỉnh sửa thông tin cá nhân dành cho người dùng đã đăng nhập.

```mermaid
usecaseDiagram
    actor "Người dùng (Đã Login)" as User
    
    package "Hệ thống Quản lý Profile" {
        usecase "Yêu cầu mã OTP sửa Profile" as UC3
        usecase "Cập nhật thông tin Profile" as UC4
        usecase "Hệ thống gửi Email OTP" as UC_Email
    }
    
    User --> UC3
    User --> UC4
    
    UC3 ..> UC_Email : <<include>>
    UC4 ..> UC3 : <<include>>
```

## 2. Sequence Diagram: Quên Mật Khẩu (Forgot Password)
Quy trình từ lúc người dùng quên mật khẩu đến khi đặt lại mật khẩu thành công.

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant C as Client (Frontend/Postman)
    participant S as Server (API)
    participant R as Redis (Cache)
    participant M as Mail Server (SMTP)
    participant DB as MySQL Database

    %% Luồng 1: Yêu cầu OTP
    U->>C: Nhập Email báo quên mật khẩu
    C->>S: POST /api/auth/forgot-password {email}
    S->>DB: Kiểm tra Email có tồn tại?
    DB-->>S: Trả về thông tin User
    S->>S: Tạo mã OTP (6 số)
    S->>R: Lưu OTP với key "forgot:otp:email" (TTL: 10 phút)
    R-->>S: OK
    S->>M: Gửi mã OTP qua Email
    M-->>S: OK
    S-->>C: 200 OK - "OTP đã được gửi..."
    C-->>U: Hiển thị thông báo kiểm tra Email

    %% Luồng 2: Xác nhận Đặt lại Mật Khẩu
    U->>M: Mở hộp thư để lấy OTP
    M-->>U: Mã OTP
    U->>C: Nhập OTP và Mật khẩu mới
    C->>S: POST /api/auth/reset-password {email, otp, newPassword}
    S->>R: Lấy OTP từ key "forgot:otp:email"
    R-->>S: Trả về mã OTP đã lưu
    S->>S: So sánh OTP (Khớp)
    S->>S: Băm (Hash) Mật khẩu mới bằng bcrypt
    S->>DB: Cập nhật mật khẩu mới cho User
    DB-->>S: Thành công
    S->>R: Xóa OTP khỏi Redis
    R-->>S: OK
    S-->>C: 200 OK - "Đặt lại thành công"
    C-->>U: Hiển thị thông báo đổi mật khẩu thành công
```

## 3. Sequence Diagram: Cập nhật Profile với OTP
Quy trình bảo mật 2 bước để sửa thông tin cá nhân (đã đăng nhập).

```mermaid
sequenceDiagram
    autonumber
    actor U as Người dùng (Đã Login)
    participant C as Client (Frontend/Postman)
    participant S as Server (API)
    participant R as Redis (Cache)
    participant M as Mail Server (SMTP)
    participant DB as MySQL Database

    %% Luồng 1: Yêu cầu OTP
    U->>C: Bấm nút "Chỉnh sửa thông tin"
    C->>S: POST /api/users/profile/request-otp (Header: Bearer Token)
    S->>S: Lấy userId, email từ Token
    S->>DB: Kiểm tra User tồn tại
    DB-->>S: OK
    S->>S: Tạo mã OTP (6 số)
    S->>R: Lưu OTP với key "edit_profile:otp:email" (TTL: 10 phút)
    R-->>S: OK
    S->>M: Gửi mã OTP bảo mật qua Email
    M-->>S: OK
    S-->>C: 200 OK - "OTP đã được gửi..."
    C-->>U: Yêu cầu người dùng nhập OTP

    %% Luồng 2: Xác nhận sửa thông tin
    U->>M: Mở hộp thư để lấy OTP
    M-->>U: Mã OTP
    U->>C: Điền OTP và thông tin mới (fullName, phone, address)
    C->>S: PUT /api/users/profile {otp, fullName, phone, address}
    S->>R: Lấy OTP từ key "edit_profile:otp:email"
    R-->>S: Trả về mã OTP đã lưu
    S->>S: So sánh OTP (Khớp)
    S->>DB: Cập nhật dữ liệu mới vào bảng Users
    DB-->>S: Thành công
    S->>R: Xóa OTP khỏi Redis
    R-->>S: OK
    S-->>C: 200 OK - Trả về Profile mới
    C-->>U: Hiển thị Profile đã cập nhật thành công
```
