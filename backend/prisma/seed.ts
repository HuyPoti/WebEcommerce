import { PrismaClient, LoaiDanhMuc, KichCo, VaiTro, TrangThai } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang bắt đầu seed dữ liệu...');

  // 1. Xóa dữ liệu cũ (Tùy chọn, reset migrate đã làm việc này nhưng cẩn thận vẫn hơn)
  // Lưu ý: reset migrate sẽ xóa hết nên không cần deleteManual ở đây.

  // 2. Tạo Danh mục
  console.log('📁 Tạo danh mục...');
  const dmAo = await prisma.dANHMUC.create({
    data: {
      TenDM: 'Áo Thời Trang',
      Loai: LoaiDanhMuc.AO,
      TrangThai: TrangThai.ACTIVE,
    },
  });

  const dmQuan = await prisma.dANHMUC.create({
    data: {
      TenDM: 'Quần Jeans & Kaki',
      Loai: LoaiDanhMuc.QUAN,
      TrangThai: TrangThai.ACTIVE,
    },
  });

  const dmPhuKien = await prisma.dANHMUC.create({
    data: {
      TenDM: 'Phụ Kiện Cao Cấp',
      Loai: LoaiDanhMuc.PHU_KIEN,
      TrangThai: TrangThai.ACTIVE,
    },
  });

  // 3. Tạo Tài khoản mẫu
  console.log('👤 Tạo tài khoản mẫu...');
  await prisma.tAIKHOAN.createMany({
    data: [
      {
        Username: 'admin',
        Email: 'admin@flexstyle.com',
        DisplayName: 'Hệ thống Quản trị',
        VAITRO: VaiTro.ADMIN,
        Status: TrangThai.ACTIVE,
      },
      {
        Username: 'manager',
        Email: 'manager@flexstyle.com',
        DisplayName: 'Quản lý Cửa hàng',
        VAITRO: VaiTro.QLDN,
        Status: TrangThai.ACTIVE,
      },
      {
        Username: 'customer1',
        Email: 'khachhang1@gmail.com',
        DisplayName: 'Nguyễn Văn A',
        VAITRO: VaiTro.KH,
        Status: TrangThai.ACTIVE,
      },
    ],
  });

  // 4. Tạo Sản phẩm mồi
  console.log('👕 Tạo sản phẩm mẫu...');
  const sp1 = await prisma.sANPHAM.create({
    data: {
      TenSP: 'Áo T-Shirt Flex Basic',
      MoTa: 'Chất liệu cotton 100% co giãn 4 chiều, thoáng mát.',
      GiaMua: 150000,
      GiaBan: 299000,
      MauSac: 'Trắng',
      slug: 'ao-t-shirt-flex-basic',
      MaDM: dmAo.MaDM,
      HinhAnh: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300&h=400'],
    },
  });

  const sp2 = await prisma.sANPHAM.create({
    data: {
      TenSP: 'Quần Jeans Slim Fit',
      MoTa: 'Dáng ôm vừa vặn, phong cách hiện đại.',
      GiaMua: 300000,
      GiaBan: 550000,
      MauSac: 'Xanh Navy',
      slug: 'quan-jeans-slim-fit',
      MaDM: dmQuan.MaDM,
      HinhAnh: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=300&h=400'],
    },
  });

  // 5. Tạo Chi tiết sản phẩm (Kho hàng)
  console.log('📦 Nhập kho hàng...');
  const sizes = [KichCo.M, KichCo.L, KichCo.XL];

  for (const size of sizes) {
    await prisma.cHITIETSANPHAM.create({
      data: {
        MaSP: sp1.MaSP,
        KichCo: size,
        SoLuong: 50,
      },
    });

    await prisma.cHITIETSANPHAM.create({
      data: {
        MaSP: sp2.MaSP,
        KichCo: size,
        SoLuong: 30,
      },
    });
  }

  // 6. Tạo Vouchers
  console.log('🎫 Tạo mã giảm giá...');
  await prisma.vOUCHER.create({
    data: {
      TenVoucher: 'Chào mừng thành viên mới',
      Code: 'WELCOMEBACK',
      Loai: 'GiamGia',
      SoTien: 50000,
      SoLuong: 100,
      NgayBatDau: new Date(),
      NgayKetThuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày tới
      Dieukien: 200000,
      TrangThai: TrangThai.ACTIVE,
    },
  });

  console.log('✅ Seed dữ liệu hoàn tất!');
}

main()
  .catch(async (e) => {
    console.error('❌ Lỗi khi seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });