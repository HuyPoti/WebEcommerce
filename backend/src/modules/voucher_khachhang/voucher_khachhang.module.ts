import { Module } from '@nestjs/common';
import { VoucherKhachHangController } from './voucher_khachhang.controller';
import { VoucherKhachHangService } from './voucher_khachhang.service';
import { VoucherKhachHangRepository } from 'src/common/repositories/voucher_khachhang.repository';
import { VoucherRepository } from 'src/common/repositories/voucher.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoucherKhachHangController],
  providers: [VoucherKhachHangService, VoucherKhachHangRepository, VoucherRepository],
  exports: [VoucherKhachHangRepository],
})
export class VoucherKhachHangModule {}
