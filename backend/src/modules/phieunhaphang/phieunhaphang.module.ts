import { Module } from '@nestjs/common';
import { PhieuNhapHangController } from './phieunhaphang.controller';
import { PhieuNhapHangService } from './phieunhaphang.service';
import { PhieuNhapHangRepository } from 'src/common/repositories/phieunhaphang.repository';

@Module({
  controllers: [PhieuNhapHangController],
  providers: [PhieuNhapHangService, PhieuNhapHangRepository],
  exports: [PhieuNhapHangRepository],
})
export class PhieuNhapHangModule {}
