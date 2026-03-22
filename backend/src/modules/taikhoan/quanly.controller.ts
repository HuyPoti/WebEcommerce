import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaikhoanService } from './taikhoan.service';
import { TAIKHOAN } from './taikhoan.service';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from './taikhoan.guard';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import {
  TaiKhoanNghiepVuDto,
  UpdateTaiKhoanNghiepVuDto,
} from './dto/taikhoannghiepvu.dto';
import { TrangThai } from './enums';

@Controller('ql')
export class QuanLyController {
  constructor(private readonly taikhoanService: TaikhoanService) {}

  // ============================================================
  // ðŸ§‘â€ðŸ’¼ QUáº¢N LÃ DOANH NGHIá»†P (QLDN)
  // ============================================================

  @Post('dangky')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async dangKyQL(@Body() data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    return this.taikhoanService.dangKyQL(data);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getAllQL(): Promise<TAIKHOAN[]> {
    return this.taikhoanService.taikhoansQL();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getQL(@Param('id') maTK: string): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'QLDN') throw new Error('KhÃ´ng tÃ¬m tháº¥y QLDN');
    return tk;
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateQL(
    @Param('id') maTK: string,
    @Body() data: UpdateTaiKhoanNghiepVuDto,
  ) {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'QLDN') throw new Error('KhÃ´ng tÃ¬m tháº¥y QLDN');
    return this.taikhoanService.updateTaiKhoan(maTK, data);
  }

  @Patch('status/:id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateStatusQL(
    @Param('id') maTK: string,
    @Body('status') status: TrangThai,
  ): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'QLDN') throw new Error('KhÃ´ng tÃ¬m tháº¥y QLDN');
    return this.taikhoanService.updateTrangThai(maTK, status);
  }
}
