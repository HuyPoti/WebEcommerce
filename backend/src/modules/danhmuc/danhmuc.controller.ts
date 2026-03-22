import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DanhMucService } from './danhmuc.service';
import { DanhMucDto } from './dto/danhmuc.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { LoaiDanhMuc } from 'src/common/constant';
import type { Response } from 'express';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';

@Controller('danhmuc')
export class DanhMucController {
  constructor(private readonly danhmucService: DanhMucService) {}

  // Xem thÃ´ng tin danh má»¥c (táº¥t cáº£ danh má»¥c)
  @Get()
  @ResponseMessage('Láº¥y danh má»¥c thÃ nh cÃ´ng')
  getAllDanhMuc() {
    return this.danhmucService.getAllDanhMuc();
  }
  // Xem thÃ´ng tin danh má»¥c theo id
  @Get(':id')
  @ResponseMessage('Láº¥y danh má»¥c theo id thÃ nh cÃ´ng')
  getDanhMucById(@Param('id') id: string) {
    return this.danhmucService.getDanhMucById(id);
  }

  // ThÃªm má»›i danh má»¥c sáº£n pháº©m
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post()
  @ResponseMessage('ThÃªm danh má»¥c thÃ nh cÃ´ng')
  addDanhMuc(@Body() data: DanhMucDto) {
    return this.danhmucService.addDanhMuc(data);
  }

  // Cáº­p nháº­t thÃ´ng tin danh má»¥c
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put('/update/:id')
  @ResponseMessage('Cáº­p nháº­t danh má»¥c thÃ nh cÃ´ng')
  updateDanhMuc(@Param('id') id: string, @Body() data: DanhMucDto) {
    return this.danhmucService.updateDanhMuc(id, data);
  }

  // Thay Ä‘á»•i tráº¡ng thÃ¡i danh má»¥c
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put(':id/trangthai')
  @ResponseMessage('Thay Ä‘á»•i tráº¡ng thÃ¡i danh má»¥c thÃ nh cÃ´ng')
  changeTrangThai(
    @Param('id') id: string,
    @Body('trangThai') trangThai: string,
  ) {
    return this.danhmucService.changeTrangThai(id, trangThai);
  }

  // Thay Ä‘á»•i loáº¡i danh má»¥c
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put(':id/loai')
  @ResponseMessage('Thay Ä‘á»•i loáº¡i danh má»¥c thÃ nh cÃ´ng')
  changeLoai(@Param('id') id: string, @Body('loai') loai: LoaiDanhMuc) {
    return this.danhmucService.changeLoai(id, loai);
  }

  // Xuáº¥t danh má»¥c sáº£n pháº©m (vÃ­ dá»¥: export ra file, á»Ÿ Ä‘Ã¢y tráº£ vá» danh sÃ¡ch)
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('export')
  @ResponseMessage('Xuáº¥t danh má»¥c thÃ nh cÃ´ng')
  async exportDanhMucToExcel(@Res() res: Response) {
    try {
      const excelBuffer = await this.danhmucService.exportDanhMucToExcel();

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="danhmuc.xlsx"',
        'Content-Length': excelBuffer.length,
      });
      res.send(excelBuffer);
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Xuáº¥t danh má»¥c tháº¥t báº¡i', error: error.message });
    }
  }
}
