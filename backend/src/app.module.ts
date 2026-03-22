import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './common/core/app.controller';
import { AppService } from './common/core/app.service';
import { DanhMucModule } from './modules/danhmuc/danhmuc.module';
import { SuKienUuDaiModule } from './modules/sukienuudai/sukienuudai.module';
import { SanphamModule } from './modules/sanpham/sanpham.module';
import { ChitietsanphamModule } from './modules/chitietsanpham/chitietsanpham.module';
import { ChitietnhaphangModule } from './modules/chitietnhaphang/chitietnhaphang.module';
import { GiohangModule } from './modules/giohang/giohang.module';
import { DonhangModule } from './modules/donhang/donhang.module';
import { TinhtrangDonhangModule } from './modules/tinhtrangdonhang/tinhtrangdonhang.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { TaikhoanService } from './modules/taikhoan/taikhoan.service';
import { KhachHangController } from './modules/taikhoan/khachhang.controller';
import { NhanVienController } from './modules/taikhoan/nhanvien.controller';
import { QuanLyController } from './modules/taikhoan/quanly.controller';
import { NhaCungCapController } from './modules/taikhoan/nhacungcap.controller';
import { TaikhoanModule } from './modules/taikhoan/taikhoan.module';
import { VoucherKhachHangModule } from './modules/voucher_khachhang/voucher_khachhang.module';
import { PhanHoiModule } from './modules/phanhoi/phanhoi.module';
import { PhieuNhapHangModule } from './modules/phieunhaphang/phieunhaphang.module';
import { JwtService } from '@nestjs/jwt';
import { PaypalModule } from './modules/paypal/paypal.module';
import { VNPAYModule } from './modules/vnpay/vnpay.module';
import { ThanhtoanModule } from './modules/thanhtoan/thanhtoan.module';
import { ThongbaoModule } from './modules/thongbao/thongbao.module';
import { GeminiModule } from './modules/gemini/gemini.module';
import { ThongkeController } from './modules/thongke/thongke.controller';
import { ThongkeService } from './modules/thongke/thongke.service';
import { ThongkeModule } from './modules/thongke/thongke.module';
import { AuditModule } from './modules/audit/audit.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    // Prisma module ph?i d?ng tru?c d? các service khác inject PrismaService
    // PrismaModule,
    PaypalModule,
    DanhMucModule,
    SuKienUuDaiModule,
    SanphamModule,
    ChitietsanphamModule,
    ChitietnhaphangModule,
    GiohangModule,
    DonhangModule,
    TinhtrangDonhangModule,
    VoucherModule,
    TaikhoanModule,
    VoucherKhachHangModule,
    PhanHoiModule,
    PhieuNhapHangModule,
    VNPAYModule,
    ThanhtoanModule,
    ThongbaoModule,
    GeminiModule,
    ThongkeModule,
    AuditModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [
    AppController,
    KhachHangController,
    NhanVienController,
    QuanLyController,
    NhaCungCapController,
    ThongkeController,
  ],
  providers: [
    AppService,
    TaikhoanService,
    JwtService,
    ThongkeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    // Sentinel log to verify recompilation
    console.log(
      '[AppModule] Bootstrapping with modules: DanhMuc, Sukienuudai, Sanpham, ChitietSanpham, Giohang, Donhang, TinhtrangDonhang, Voucher, VoucherKhachhang - V9',
    );
  }
}
