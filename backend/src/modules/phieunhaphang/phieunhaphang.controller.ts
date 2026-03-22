import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { PhieuNhapHangDto } from './dto/phieunhaphang.dto';
import { PhieuNhapHangService } from './phieunhaphang.service';
import { Roles } from 'src/common/factory_function/role';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { TrangThaiPhieuNhapHang } from '@prisma/client';

@Controller('phieunhaphang')
export class PhieuNhapHangController {
  constructor(private readonly phieuNhapHangService: PhieuNhapHangService) {}
  //láº¥y danh sÃ¡ch phiáº¿u nháº­p hÃ ng
  @Get('/ncc/:id')
  @ResponseMessage('Láº¥y phiáº¿u nháº­p hÃ ng theo id thÃ nh cÃ´ng')
  getByIdNcc(@Param('id') id: string) {
    return this.phieuNhapHangService.findByIdNcc(id);
  }
  //láº¥y phiáº¿u nháº­p hÃ ng theo id
  @Get()
  @ResponseMessage('Láº¥y danh sÃ¡ch phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  getAll() {
    return this.phieuNhapHangService.findAll();
  }
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('/paged')
  @ResponseMessage('Láº¥y danh sÃ¡ch phiáº¿u nháº­p hÃ ng phÃ¢n trang thÃ nh cÃ´ng')
  async getPaged(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    console.log('Received paged query:', { page, pageSize, status, date });
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const statusEnum = status
      ? (status as unknown as TrangThaiPhieuNhapHang)
      : undefined;
    return this.phieuNhapHangService.findPaged({
      page: pageNum,
      pageSize: pageSizeNum,
      status: statusEnum,
      date,
    });
  }
  @Get(':id')
  @ResponseMessage('Láº¥y phiáº¿u nháº­p hÃ ng theo id thÃ nh cÃ´ng')
  getById(@Param('id') id: string) {
    return this.phieuNhapHangService.findById(id);
  }

  // Láº¥y danh sÃ¡ch phiáº¿u nháº­p hÃ ng cÃ³ phÃ¢n trang, lá»c tráº¡ng thÃ¡i vÃ  ngÃ y

  //táº¡o phiáº¿u nháº­p hÃ ng
  @Roles('QLDN')
  @Post()
  @ResponseMessage('Táº¡o phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  createPhieuNhapHang(@Body() data: PhieuNhapHangDto) {
    return this.phieuNhapHangService.create(data);
  }
  //chá»‰nh sá»­a phiÃªu nháº­p hÃ ng
  @Put(':id')
  @ResponseMessage('Cáº­p nháº­t phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  updatePhieuNhapHang(@Param('id') id: string, @Body() data: PhieuNhapHangDto) {
    return this.phieuNhapHangService.update(id, data);
  }

  //NhÃ¢n viÃªn xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  @Put(':id/nhanvienxacnhan')
  @Roles('QLDN')
  @ResponseMessage('XÃ¡c nháº­n phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  nhanVienXacNhan(
    @Param('id') id: string,
    @Body('MaTKNVXN') MaTKNVXN: string,
    @Body('NoiDung') NoiDung: string,
  ) {
    return this.phieuNhapHangService.nhanVienXacNhan(id, MaTKNVXN, NoiDung);
  }

  //NhÃ  cung cáº¥p xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  @Roles('NCC')
  @Put(':id/nhacungcapxacnhan')
  @ResponseMessage('NhÃ  cung cáº¥p xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  nhaCungCapXacNhan(@Param('id') id: string, @Body('NoiDung') NoiDung: string) {
    return this.phieuNhapHangService.nhaCungCapXacNhan(id, NoiDung);
  }

  //NhÃ  cung cáº¥p tá»« chá»‘i phiáº¿u nháº­p hÃ ng
  @Roles('NCC')
  @Put(':id/nhacungcaptuchoi')
  @ResponseMessage('NhÃ  cung cáº¥p tá»« chá»‘i phiáº¿u nháº­p hÃ ng thÃ nh cÃ´ng')
  nhaCungCapTuChoi(@Param('id') id: string, @Body('NoiDung') NoiDung: string) {
    return this.phieuNhapHangService.nhaCungCapTuChoi(id, NoiDung);
  }
}
