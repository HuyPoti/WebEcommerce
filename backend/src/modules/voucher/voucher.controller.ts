import { Controller, Get, Param, Post, Put, Res, Body } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import type { Response } from 'express';
import { CreateVoucherDto, VoucherDto } from './dto/voucher.dto';
import { Roles } from 'src/common/factory_function/role';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}
  //láº¥y danh sÃ¡ch voucher
  @Get()
  @ResponseMessage('Láº¥y danh sÃ¡ch voucher thÃ nh cÃ´ng')
  async getAllVouchers(@Body() data: VoucherDto) {
    return this.voucherService.getAllVouchers();
  }

  @Roles('NVVH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get("/all")
  @ResponseMessage('Láº¥y danh sÃ¡ch voucher thÃ nh cÃ´ng')
  async getAllVouchersForNV() {
    return this.voucherService.getAllVouchers();
  }

  //láº¥y voucher theo id
  @Get('/:id')
  @ResponseMessage('Láº¥y voucher theo id thÃ nh cÃ´ng')
  async getVoucherById(@Param('id') id: string) {
    return this.voucherService.getVoucherById(id);
  }

  @Get('/code/:id')
  @ResponseMessage('Láº¥y voucher theo mÃ£ thÃ nh cÃ´ng')
  async getVoucherByCode(@Param('id') id: string) {
    return this.voucherService.getVoucherByCode(id);
  }
  // thÃªm má»›i voucher
  @Roles('NVVH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post("/add")
  @ResponseMessage('ThÃªm má»›i voucher thÃ nh cÃ´ng')
  async addVoucher(@Body() voucherDto: CreateVoucherDto) {
    return this.voucherService.addVoucher(voucherDto);
  }
  //chá»‰nh sá»­a voucher theo id
  @Put('/update/:id')
  @ResponseMessage('Chá»‰nh sá»­a voucher thÃ nh cÃ´ng')
  async updateVoucher(@Param('id') id: string, @Body() voucherDto: any) {
    return this.voucherService.updateVoucher(id, voucherDto);
  }

  //thay Ä‘á»•i tráº¡ng thÃ¡i voucher
  @Put(':id/trangthai')
  @ResponseMessage('Thay Ä‘á»•i tráº¡ng thÃ¡i voucher thÃ nh cÃ´ng')
  async changeStatus(
    @Param('id') id: string,
    @Body('trangThai') trangThai: string,
  ) {
    return this.voucherService.changeStatus(id, trangThai);
  }

  //xuáº¥t bÃ¡o cÃ¡o excel voucher
  // @Get('export')
  // async exportVoucherToExcel(@Res() res: Response) {
  //   try {
  //     const excelBuffer = await this.voucherService.exportVoucherToExcel();
  //     res.set({
  //       'Content-Type':
  //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       'Content-Disposition': 'attachment; filename=voucher_report.xlsx',
  //     });
  //     res.end(excelBuffer);
  //   } catch (error) {
  //     res
  //       .status(400)
  //       .json({ message: 'Xuáº¥t voucher tháº¥t báº¡i', error: error.message });
  //   }
  // }
}
