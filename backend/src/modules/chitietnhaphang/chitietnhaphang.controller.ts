import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ChitietnhaphangService } from './chitietnhaphang.service';
import { CreateChiTietNhapHangDto } from './dto/create-chitietnhaphang.dto';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';

@Controller('chitietnhaphang')
export class ChitietnhaphangController {
  constructor(private readonly service: ChitietnhaphangService) {}

  // láº¥y chi tiáº¿t nháº­p hÃ ng theo mÃ£ phiáº¿u
  @Get('phieu/:MaPNH')
  async getByPhieu(@Param('MaPNH') MaPNH: string) {
    return this.service.findByPhieu(MaPNH);
  }
  // danh sÃ¡ch cÃ¡c CTSP sáº£n pháº©m
  @Get('variants')
  async getVariants() {
    return this.service.listVariants();
  }
  // tÃ¬m kiáº¿m CTSP sáº£n pháº©m theo tá»« khÃ³a
  @Get('variants/search')
  async searchVariants(@Query('q') q: string) {
    return this.service.searchVariants(q);
  }
  // láº¥y CTSP sáº£n pháº©m theo mÃ£
  @Get('variants/:MaCTSP')
  async getVariantById(@Param('MaCTSP') MaCTSP: string) {
    return this.service.getVariant(MaCTSP);
  }


  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post('phieu/:MaPNH')
  async createForPhieu(
    @Param('MaPNH') MaPNH: string,
    @Body() items: CreateChiTietNhapHangDto[],
  ) {
    return this.service.createForPhieu(MaPNH, items as any);
  }
}
