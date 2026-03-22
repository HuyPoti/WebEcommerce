import { Module } from '@nestjs/common';
import { SanphamController } from './sanpham.controller';
import { SanphamService } from './sanpham.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';

@Module({
  imports: [PrismaModule],
  controllers: [SanphamController],
  providers: [SanphamService, TaiKhoanGuard],
})
export class SanphamModule {}
