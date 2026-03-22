# 👕 Flex Style Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)

**Flex Style** là nền tảng thương mại điện tử hiện đại, tập trung vào trải nghiệm người dùng cao cấp và hệ thống quản trị mạnh mẽ. Dự án được phát triển theo cấu trúc Monorepo, đảm bảo tính đồng bộ và dễ dàng mở rộng.

---

## 🏗️ Kiến trúc Hệ thống

Hệ thống được chia làm 2 phần chính:

- **Frontend (`/frontend`)**: Xây dựng trên Next.js 15 (App Router), tích hợp Supabase Auth và Tailwind CSS cho giao diện Responsive.
- **Backend (`/backend`)**: NestJS API mạnh mẽ, sử dụng Prisma ORM kết nối PostgreSQL, tích hợp các lớp bảo vệ chuyên sâu (Helmet, Rate Limit, Audit Log).

---

## ⚡ Các Tính năng Nổi bật

### 🔥 Nghiệp vụ Phức tạp
- **Quản lý sản phẩm đa biến thể**: Kích cỡ (S, M, L, XL, XXL), Màu sắc, Tình trạng kho.
- **Hệ thống giỏ hàng & Đơn hàng**: Tự động tính toán tổng tiền, áp dụng Voucher và Sự kiện ưu đãi.
- **Thanh toán đa phương thức**: Tích hợp VNPAY và PayPal (Sandbox).
- **Thống kê chi tiết**: Báo cáo doanh thu và biểu đồ trực quan (Recharts).

### 🛡️ Bảo mật Chuyên sâu (Advanced Security)
Chúng tôi ưu tiên bảo mật thông tin với các lớp bảo vệ chuẩn doanh nghiệp:
- **HTTP Hardening**: Tích hợp `Helmet` giúp chống XSS, Clickjacking và Sniffing.
- **Rate Limiting**: Giới hạn 100 request/phút/IP để chống Brute-force và Spam API.
- **Recursive Data Masking**: Tự động che giấu thông tin nhạy cảm (mật khẩu, token) trong mọi API Response.
- **Audit Logging**: Nhật ký hành động ghi lại mọi thay đổi nhạy cảm (ai sửa hàng, ai khóa tài khoản).
- **Security Headers & CSP**: Chính sách bảo mật trình duyệt nghiêm ngặt trong Next.js.
- **Input Neutralization**: Whitelist validation cho mọi dữ liệu đầu vào.

---

## 🛠️ Yêu cầu Hệ thống

| Công cụ | Phiên bản |
| --- | --- |
| Node.js | >= 20.x (LTS) |
| NPM | >= 10.x |
| PostgreSQL | >= 14 |

---

## 🚀 Hướng dấn Cài đặt nhanh

### 1. Cấu hình Biến môi trường
Tạo file `.env` tại các thư mục tương ứng theo mẫu `env.example`.

### 2. Triển khai Backend
```powershell
cd backend
npm install
# Khởi tạo DB & Audit Log
npx prisma db push
npm run start:dev
```
API phục vụ tại: `http://localhost:8080/api`  
Swagger: `http://localhost:8080/api/docs` (Chỉ hiển thị ở Dev)

### 3. Triển khai Frontend
```powershell
cd ../frontend
npm install
npm run dev
```
Web phục vụ tại: `http://localhost:3000`

---

## 🧪 Kiểm thử & Chất lượng Code

Dự án tích hợp sẵn bộ gõ test bảo mật:
```powershell
# Chạy Security Unit Tests (Backend)
npm run test response.interceptor.spec.ts jwt.guard.spec.ts

# Lint & Format
npm run lint
npm run format
```

---

## 📜 Giấy phép (License)

Dự án được phát hành dưới giấy phép **MIT**. Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---
**Flex Style Team** 🚀 - *Building the future of E-commerce*

