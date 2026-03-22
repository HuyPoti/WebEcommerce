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
import { TaiKhoanNghiepVuDto } from './dto/taikhoannghiepvu.dto';
import { VaiTro } from './enums';

@Controller('nv')
export class NhanVienController {
  constructor(private readonly taikhoanService: TaikhoanService) {}

  @Post('dangky')
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async dangKyNV(@Body() data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    return this.taikhoanService.dangKyNV(data);
  }

  @Get()
  @Roles('QLDN', 'ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getAllNV(): Promise<TAIKHOAN[]> {
    const nv = await this.taikhoanService.taikhoansNV();
    // console.log('nv:', nv);
    return nv;
  }

  @Get(':id')
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getNV(@Param('id') maTK: string): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO === 'NVVH' || tk?.VAITRO === 'NVCSKH') return tk;
    throw new Error('KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn');
  }

  @Patch('role/:id')
  @Roles('QLDN', 'ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateRoleNV(
    @Param('id') maTK: string,
    @Body('vaiTro') vaiTro: VaiTro,
  ): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);

    if (tk?.VAITRO === 'NVVH' || tk?.VAITRO === 'NVCSKH') {
      return this.taikhoanService.updateVaiTro(maTK, vaiTro);
    }
    throw new Error('KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn');
  }

  @Patch(':id')
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateNV(
    @Param('id') maTK: string,
    @Body() data: TaiKhoanNghiepVuDto,
  ): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO === 'NVVH' || tk?.VAITRO === 'NVCSKH') {
      console.log('data update nv:', data);
      return this.taikhoanService.updateTaiKhoanDoanhNghiep(maTK, data);
    }
    throw new Error('KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn');
  }
}
