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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import {
  CreateTinhtrangDonhangDto,
  UpdateTinhtrangDonhangDto,
  TinhtrangDonhangResponseDto,
  TinhtrangDonhangHistoryDto,
  TinhtrangDonhangStatsDto,
  TrangThaiDonHang,
} from './dto/tinhtrangdonhang.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@ApiTags('TÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng')
@Controller('tinhtrangdonhang')
export class TinhtrangDonhangController {
  constructor(
    private readonly tinhtrangDonhangService: TinhtrangDonhangService
  ) {
    console.log('[TinhtrangDonhangController] Loaded');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Táº¡o tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng má»›i' })
  @ApiBody({ type: CreateTinhtrangDonhangDto })
  @ApiResponse({
    status: 201,
    description: 'Táº¡o tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Táº¡o tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async createOrderStatus(
    @Body() createDto: CreateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.createOrderStatus(createDto);
  }

  @Put('order/:MaDH')
  @ApiOperation({ summary: 'Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiBody({ type: UpdateTinhtrangDonhangDto })
  @ApiResponse({
    status: 200,
    description: 'Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'KhÃ´ng thá»ƒ chuyá»ƒn tráº¡ng thÃ¡i',
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async updateOrderStatus(
    @Param('MaDH') MaDH: string,
    @Body() updateDto: UpdateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.updateOrderStatus(
      MaDH,
      updateDto
    );
  }

  @Get()
  @ApiOperation({ summary: 'Láº¥y táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng' })
  @ApiQuery({
    name: 'MaDH',
    required: false,
    description: 'Lá»c theo mÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiQuery({
    name: 'TrangThai',
    required: false,
    enum: TrangThaiDonHang,
    description: 'Lá»c theo tráº¡ng thÃ¡i',
    example: TrangThaiDonHang.DANG_GIAO,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sá»‘ trang',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Sá»‘ lÆ°á»£ng má»—i trang',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y danh sÃ¡ch tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
  })
  @ResponseMessage('Láº¥y danh sÃ¡ch tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getAllOrderStatuses(
    @Query('MaDH') MaDH?: string,
    @Query('TrangThai') TrangThai?: TrangThaiDonHang,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number
  ) {
    return await this.tinhtrangDonhangService.getAllOrderStatuses(
      MaDH,
      TrangThai,
      page,
      limit
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Láº¥y thá»‘ng kÃª tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng' })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y thá»‘ng kÃª thÃ nh cÃ´ng',
    type: TinhtrangDonhangStatsDto,
  })
  @ResponseMessage('Láº¥y thá»‘ng kÃª tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getOrderStatusStatistics(): Promise<TinhtrangDonhangStatsDto> {
    return await this.tinhtrangDonhangService.getOrderStatusStatistics();
  }

  @Get('history/:MaDH')
  @ApiOperation({ summary: 'Láº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i cá»§a Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i thÃ nh cÃ´ng',
    type: TinhtrangDonhangHistoryDto,
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i' })
  @ResponseMessage('Láº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getOrderStatusHistory(
    @Param('MaDH') MaDH: string
  ): Promise<TinhtrangDonhangHistoryDto> {
    return await this.tinhtrangDonhangService.getOrderStatusHistory(MaDH);
  }

  @Get('current/:MaDH')
  @ApiOperation({ summary: 'Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i cá»§a Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i thÃ nh cÃ´ng',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y tráº¡ng thÃ¡i' })
  @ResponseMessage('Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i thÃ nh cÃ´ng')
  async getCurrentOrderStatus(
    @Param('MaDH') MaDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.getCurrentOrderStatus(MaDH);
  }

  @Get(':MaTTDH')
  @ApiOperation({ summary: 'Láº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng theo ID' })
  @ApiParam({
    name: 'MaTTDH',
    description: 'MÃ£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng',
    example: 'uuid-ttdh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Láº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getOrderStatusById(
    @Param('MaTTDH') MaTTDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.getOrderStatusById(MaTTDH);
  }

  @Delete(':MaTTDH')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaTTDH',
    description: 'MÃ£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng',
    example: 'uuid-ttdh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    schema: {
      example: {
        success: true,
        message: 'XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async deleteOrderStatus(
    @Param('MaTTDH') MaTTDH: string
  ): Promise<{ message: string }> {
    return await this.tinhtrangDonhangService.deleteOrderStatus(MaTTDH);
  }

  @Delete('order/:MaDH/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng cá»§a má»™t Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    schema: {
      example: {
        success: true,
        message: 'XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async deleteAllOrderStatuses(
    @Param('MaDH') MaDH: string
  ): Promise<{ message: string }> {
    return await this.tinhtrangDonhangService.deleteAllOrderStatuses(MaDH);
  }
}
