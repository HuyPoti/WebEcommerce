# Hướng dẫn khởi tạo và Seed Database

Tài liệu này ghi lại các bước để làm sạch database và nạp dữ liệu mẫu cho dự án.

## 1. Các câu lệnh thực hiện

Chạy các lệnh này tại thư mục `backend/`:

### 1.1 Reset Database
Lệnh này sẽ xóa toàn bộ các bảng hiện có, chạy lại toàn bộ migrations và thực hiện hàm `main()` trong file `seed.ts`.
```powershell
npx prisma migrate reset --force
```

### 1.2 Seed dữ liệu (Nếu muốn chạy riêng)
Nếu bạn chỉ muốn nạp dữ liệu mà không muốn xóa database (lưu ý có thể gây lỗi trùng khóa chính):
```powershell
npx prisma db seed
```

### 1.3 Kiểm tra dữ liệu (Prisma Studio)
Để xem dữ liệu trực quan trên trình duyệt:
```powershell
npx prisma studio
```

## 2. Xử lý sự cố thường gặp

### 2.1 Lỗi P1001 (Can't reach database)
Nếu bạn gặp lỗi này khi chạy lệnh trên môi trường của tôi, nguyên nhân thường do firewall hoặc DNS không giải quyết được hostname của Supabase.
**Giải pháp:** Hãy copy file `seed.ts` và chạy các lệnh trên tại terminal máy cá nhân của bạn.

### 2.3 Phân quyền (Supabase)
Đảm bảo bạn đã cho phép (whitelist) IP của mình trong dashboard Supabase nếu bạn sử dụng kết nối trực tiếp (5432).

## 3. Dữ liệu mẫu (Seed Data)
File `prisma/seed.ts` đã được tôi chuẩn bị sẵn với:
- 3 Danh mục (Áo, Quần, Phụ kiện)
- Sản phẩm mẫu kèm hình ảnh từ Unsplash.
- Các tài khoản: `admin`, `manager`, `customer1`.
