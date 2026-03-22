import { Controller, Get, Query, Body, Delete } from '@nestjs/common';
import { PhanHoiService } from './phanhoi.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { PhanHoiDto } from './dto/phanhoi.dto';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators';
@Controller('phanhoi')
export class PhanHoiController {
  constructor(private readonly phanHoiService: PhanHoiService) {}
  @Get()
  @ResponseMessage('Láº¥y danh sÃ¡ch pháº£n há»“i theo sáº£n pháº©m thÃ nh cÃ´ng')
  async findAll(@Query() slug: string) {
    return await this.phanHoiService.findAll(slug);
  }
  //xem chi tiáº¿t pháº£n há»“i
  @Get('detail')
  @ResponseMessage('Láº¥y chi tiáº¿t pháº£n há»“i thÃ nh cÃ´ng')
  async findById(@Query() MaPH: string) {
    return await this.phanHoiService.findById(MaPH);
  }
  //chá»‰nh sá»­a pháº£n há»“i
  @Get('edit')
  @ResponseMessage('Chá»‰nh sá»­a pháº£n há»“i thÃ nh cÃ´ng')
  async update(
    @Query() MaPH: string,
    @Body() MaTKKH: string,
    @Body() updateData: PhanHoiDto,
  ) {
    return await this.phanHoiService.update(MaPH, MaTKKH, updateData);
  }
  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m
  @Get('customer-feedback')
  @ResponseMessage('Láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m thÃ nh cÃ´ng')
  async getCustomerFeedback(@Query() MaSP: string, @Query() MaTKKH: string) {
    return await this.phanHoiService.getCustomerFeedback(MaSP, MaTKKH);
  }
  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('/all/customer-feedback')
  @ResponseMessage('Láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m thÃ nh cÃ´ng')
  async getCustomerFeedbackForNV() {
    const feedbacks = await this.phanHoiService.getCustomerFeedbackForNV();
    return feedbacks;
  }
  //xÃ³a pháº£n há»“i
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Delete('delete')
  @ResponseMessage('XÃ³a pháº£n há»“i thÃ nh cÃ´ng')
  async delete(@Query('MaPH') MaPH: string) {
    return await this.phanHoiService.delete(MaPH);
  }
}
