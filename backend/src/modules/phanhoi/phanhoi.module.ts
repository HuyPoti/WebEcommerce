import { Module } from '@nestjs/common';
import { PhanHoiController} from './phanhoi.controller';
import { PhanHoiService } from './phanhoi.service';
import { PhanHoiRepository } from 'src/common/repositories/phanhoi.repository';
import { SanPhamRepository } from 'src/common/repositories/sanpham.repository';

@Module({
  controllers: [PhanHoiController],
  providers: [PhanHoiService, PhanHoiRepository, SanPhamRepository],
  exports: [PhanHoiRepository],
})
export class PhanHoiModule {}
