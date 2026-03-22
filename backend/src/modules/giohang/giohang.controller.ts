import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GiohangService } from './giohang.service';
import { AddToCartDto, UpdateQuantityDto} from './dto/giohang.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';

@ApiTags('Giá» hÃ ng')
@Controller('giohang')
export class GiohangController {
  constructor(private readonly giohangService: GiohangService) {
    console.log('[GiohangController] Loaded');
  }

  @Roles('KH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put('/update-cart')
  @ApiOperation({ summary: 'Cáº­p nháº­t sáº£n pháº©m vÃ o giá» hÃ ng' })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m' })
  @ResponseMessage('Cáº­p nháº­t sáº£n pháº©m vÃ o giá» hÃ ng thÃ nh cÃ´ng')
  async addToCart(@Query('MaTKKH') MaTKKH: string, @Body() addToCartDto: AddToCartDto[]) {
    console.log('[GiohangController] addToCart:', addToCartDto);
    const result = await this.giohangService.updateCart(MaTKKH, addToCartDto);
    console.log('[GiohangController] addToCart result:', result);
    return result;
  }

  @Roles('KH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get()
  @ApiOperation({ summary: 'Hiá»ƒn thá»‹ táº¥t cáº£ sáº£n pháº©m trong giá» hÃ ng' })
  @ApiQuery({ name: 'MaTKKH', required: false, description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Láº¥y giá» hÃ ng thÃ nh cÃ´ng', 
    // type: CartResponseDto 
  })
  @ResponseMessage('Láº¥y giá» hÃ ng thÃ nh cÃ´ng')
  async getCartItems(@Query('MaTKKH') MaTKKH: string){
    console.log('[GiohangController] getCartItems for MaTKKH:', MaTKKH);
    const getGioHang = await this.giohangService.getCartItems(MaTKKH);
    // console.log('[GiohangController] getCartItems:', getGioHang);
    return getGioHang;
  }

  // @Put(':MaCTGH/quantity')
  // @ApiOperation({ summary: 'Thay Ä‘á»•i sá»‘ lÆ°á»£ng sáº£n pháº©m trong giá» hÃ ng' })
  // @ApiParam({ name: 'MaCTGH', description: 'MÃ£ chi tiáº¿t giá» hÃ ng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Cáº­p nháº­t sá»‘ lÆ°á»£ng thÃ nh cÃ´ng',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Cáº­p nháº­t sá»‘ lÆ°á»£ng thÃ nh cÃ´ng',
  //       data: {
  //         MaCTGH: 'uuid',
  //         SoLuong: 3,
  //         CHITIETSANPHAM: {
  //           TenSP: 'Ão thun nam',
  //           GiaBan: 200000
  //         }
  //       }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 400, description: 'KhÃ´ng Ä‘á»§ hÃ ng trong kho' })
  // @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng' })
  // @ResponseMessage('Cáº­p nháº­t sá»‘ lÆ°á»£ng thÃ nh cÃ´ng')
  // async updateQuantity(
  //   @Param('MaCTGH') MaCTGH: string,
  //   @Body() updateQuantityDto: UpdateQuantityDto,
  // ) {
  //   return await this.giohangService.updateQuantity(MaCTGH, updateQuantityDto);
  // }

  // @Delete(':MaCTGH')
  // @ApiOperation({ summary: 'XÃ³a sáº£n pháº©m ra khá»i giá» hÃ ng' })
  // @ApiParam({ name: 'MaCTGH', description: 'MÃ£ chi tiáº¿t giá» hÃ ng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'XÃ³a sáº£n pháº©m thÃ nh cÃ´ng',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'ÄÃ£ xÃ³a sáº£n pháº©m khá»i giá» hÃ ng',
  //       data: { message: 'ÄÃ£ xÃ³a sáº£n pháº©m khá»i giá» hÃ ng' }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng' })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage('ÄÃ£ xÃ³a sáº£n pháº©m khá»i giá» hÃ ng')
  // async removeFromCart(@Param('MaCTGH') MaCTGH: string) {
  //   return await this.giohangService.removeFromCart(MaCTGH);
  // }

  // @Get('checkout')
  // @ApiOperation({ summary: 'Láº¥y sáº£n pháº©m Ä‘á»ƒ mua (chuáº©n bá»‹ thanh toÃ¡n)' })
  // @ApiQuery({ name: 'MaTKKH', required: false, description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Láº¥y danh sÃ¡ch sáº£n pháº©m Ä‘á»ƒ mua thÃ nh cÃ´ng',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Sáº£n pháº©m sáºµn sÃ ng Ä‘á»ƒ mua',
  //       data: {
  //         MaGH: 'cart-uuid',
  //         totalQuantity: 5,
  //         totalValue: 1500000,
  //         readyForPurchase: true,
  //         items: []
  //       }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 400, description: 'Giá» hÃ ng trá»‘ng hoáº·c sáº£n pháº©m khÃ´ng Ä‘á»§ hÃ ng' })
  // @ResponseMessage('Sáº£n pháº©m sáºµn sÃ ng Ä‘á»ƒ mua')
  // async getItemsForPurchase(@Query('MaTKKH') MaTKKH: string) {
  //   return await this.giohangService.getItemsForPurchase(MaTKKH);
  // }

  // @Delete()
  // @ApiOperation({ summary: 'XÃ³a toÃ n bá»™ giá» hÃ ng' })
  // @ApiQuery({ name: 'MaTKKH', required: false, description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'XÃ³a toÃ n bá»™ giá» hÃ ng thÃ nh cÃ´ng',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'ÄÃ£ xÃ³a toÃ n bá»™ giá» hÃ ng',
  //       data: { message: 'ÄÃ£ xÃ³a toÃ n bá»™ giá» hÃ ng' }
  //     }
  //   }
  // })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage('ÄÃ£ xÃ³a toÃ n bá»™ giá» hÃ ng')
  // async clearCart(@Query('MaTKKH') MaTKKH: string) {
  //   return await this.giohangService.clearCart(MaTKKH);
  // }

  //táº¡o giá» hÃ ng
  
  @Post('create-cart')
  @ApiOperation({ summary: 'Táº¡o giá» hÃ ng cho khÃ¡ch hÃ ng' })
  @ApiQuery({ name: 'MaTKKH', required: false, description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng' })
  async createCart(@Query('MaTKKH') MaTKKH: string){
    return await this.giohangService.createCart(MaTKKH);
  }
}
