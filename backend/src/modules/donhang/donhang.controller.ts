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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DonhangService } from './donhang.service';
import { CreateDonhangDto, CreateDonhangStatusDto, UpdateDonhangStatusDto } from './dto/donhang.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Roles } from 'src/common/factory_function/role';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';

@ApiTags('ÄÆ¡n hÃ ng')
@Controller('donhang')
export class DonhangController {
  constructor(private readonly donhangService: DonhangService) {
    console.log('[DonhangController] Loaded');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Táº¡o Ä‘Æ¡n hÃ ng má»›i' })
  @ApiBody({ type: CreateDonhangDto })
  @ApiResponse({
    status: 201,
    description: 'Táº¡o Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dá»¯ liá»‡u khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng Ä‘á»§ hÃ ng trong kho',
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m' })
  @ResponseMessage('Táº¡o Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async createOrder(@Body() createDto: CreateDonhangDto) {
    console.log('Creating order with data:', createDto);
    return await this.donhangService.createOrder(createDto);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Láº¥y danh sÃ¡ch táº¥t cáº£ Ä‘Æ¡n hÃ ng' })
  @ApiQuery({
    name: 'MaTK_KH',
    required: false,
    description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng Ä‘á»ƒ lá»c Ä‘Æ¡n hÃ ng',
    example: 'uuid-tk-123',
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
    description: 'Sá»‘ lÆ°á»£ng Ä‘Æ¡n hÃ ng má»—i trang',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y danh sÃ¡ch Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    // type: DonhangListResponseDto,
  })
  @ResponseMessage('Láº¥y danh sÃ¡ch Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getAllOrders(
    @Query('MaTK_KH') MaTK_KH?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return await this.donhangService.getAllOrders(MaTK_KH, page, limit);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Láº¥y tá»•ng há»£p thÃ´ng tin Ä‘Æ¡n hÃ ng' })
  @ApiQuery({
    name: 'MaTK_KH',
    required: false,
    description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng',
    example: 'uuid-tk-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y tá»•ng há»£p Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    schema: {
      example: {
        success: true,
        message: 'Láº¥y tá»•ng há»£p Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
        data: {
          totalOrders: 150,
          processingOrders: 20,
          shippingOrders: 30,
          completedOrders: 90,
          cancelledOrders: 10,
          totalRevenue: 45000000,
        },
      },
    },
  })
  @ResponseMessage('Láº¥y tá»•ng há»£p Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getOrderSummary(@Query('MaTK_KH') MaTK_KH?: string) {
    return await this.donhangService.getOrderSummary(MaTK_KH);
  }

  //Láº¥y táº¥t cáº£ Ä‘Æ¡n hÃ ng
  // @Roles('NVCSKH')
  // @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('/allOrders')
  @ResponseMessage('Láº¥y táº¥t cáº£ Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getAllDonhangs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    console.log('Get all donhangs called with page:', page, 'limit:', limit);
    const donhangs = await this.donhangService.getAllOrderForStaff(page, limit);
    return donhangs;
  }

  @Put(':MaDH/status')
  @ApiOperation({ summary: 'Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiBody({ type: UpdateDonhangStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'KhÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i cho Ä‘Æ¡n hÃ ng nÃ y',
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async updateOrderStatus(
    @Param('MaDH') MaDH: string,
    @Body() updateDto: UpdateDonhangStatusDto,
  ) {
    return await this.donhangService.updateOrderStatus(MaDH, updateDto);
  }

  @Put(':MaDH/cancel')
  @ApiOperation({ summary: 'Há»§y Ä‘Æ¡n hÃ ng' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Há»§y Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'KhÃ´ng thá»ƒ há»§y Ä‘Æ¡n hÃ ng Ä‘Ã£ hoÃ n táº¥t',
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Há»§y Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async cancelOrder(@Param('MaDH') MaDH: string) {
    return await this.donhangService.cancelOrder(MaDH);
  }
  @Get(':MaDH')
  @ApiOperation({ summary: 'Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng theo ID' })
  @ApiParam({
    name: 'MaDH',
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
    // type: DonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  @ResponseMessage('Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  async getOrderById(@Param('MaDH') MaDH: string) {
    return await this.donhangService.getOrderById(MaDH);
  }

  // @Delete(':MaDH')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'XÃ³a Ä‘Æ¡n hÃ ng hoÃ n toÃ n' })
  // @ApiParam({
  //   name: 'MaDH',
  //   description: 'MÃ£ Ä‘Æ¡n hÃ ng',
  //   example: 'uuid-dh-123',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'XÃ³a Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'XÃ³a Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Chá»‰ cÃ³ thá»ƒ xÃ³a Ä‘Æ¡n hÃ ng Ä‘Ã£ hoÃ n táº¥t hoáº·c Ä‘Ã£ há»§y',
  // })
  // @ApiResponse({ status: 404, description: 'KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng' })
  // @ResponseMessage('XÃ³a Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng')
  // async deleteOrder(
  //   @Param('MaDH') MaDH: string
  // ): Promise<{ message: string }> {
  //   return await this.donhangService.deleteOrder(MaDH);
  // }

  //thÃªm tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng
  @Roles('NVCSKH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post("/status/add")
  async addOrderStatus(@Body() body: CreateDonhangStatusDto) {
    return await this.donhangService.addOrderStatus(body);
  }
}
