import { Body, Controller, Get, Query, Res } from '@nestjs/common';
import { VoucherKhachHangService } from './voucher_khachhang.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
@Controller('voucher-khachhang')
export class VoucherKhachHangController {
  constructor(
    private readonly voucherKhachHangService: VoucherKhachHangService,
  ) {}
  //xem danh sÃ¡ch voucher khÃ¡ch hÃ ng
  @Get()
  @ResponseMessage('Xem danh sÃ¡ch voucher khÃ¡ch hÃ ng thÃ nh cÃ´ng')
  async findAll(@Query('MaAuth') MaAuth: string) {
    return this.voucherKhachHangService.findAll(MaAuth);
  }
  //xem chi tiáº¿t voucher khÃ¡ch hÃ ng
  @Get(':id')
  @ResponseMessage('Xem chi tiáº¿t voucher khÃ¡ch hÃ ng thÃ nh cÃ´ng')
  async findById(@Body() MaVCKH) {
    return this.voucherKhachHangService.findById(MaVCKH);
  }
  //thÃªm voucher khÃ¡ch hÃ ng
  @Post('add')
  @ResponseMessage('ThÃªm voucher khÃ¡ch hÃ ng thÃ nh cÃ´ng')
  async add(@Body() body: { MaKH: string; MaVoucher: string }) {
    const result = this.voucherKhachHangService.add(body.MaKH, body.MaVoucher);
    return result;
  }

  //kiá»ƒm tra voucher
  @Post('check')
  @ResponseMessage('Kiá»ƒm tra voucher thÃ nh cÃ´ng')
  async check(@Body() body: { MaVoucherKH: string; invoiceTotal: number }) {
    const result = this.voucherKhachHangService.check(body.MaVoucherKH, body.invoiceTotal);
    return result;
  }

  //thay Ä‘á»•i trang thÃ¡i voucher khÃ¡ch hÃ ng
  @Post('inactive-status')
  @ResponseMessage('Cáº­p nháº­t tráº¡ng thÃ¡i voucher khÃ¡ch hÃ ng thÃ nh cÃ´ng')
  async inactiveStatus(@Body() body: { MaVC: string, MaTK: string}) {
    const result = this.voucherKhachHangService.inactiveStatus(body.MaVC, body.MaTK);
    return result;
  }
}
