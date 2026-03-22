import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { SanphamService } from './sanpham.service';
import { SanPhamDto } from './dto/sanpham.dto';
import { Roles } from 'src/common/factory_function/role';
import { JwtAuthGuard } from 'src/modules/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/modules/taikhoan/taikhoan.guard';
import { Prisma } from '@prisma/client';
@Controller('sanpham')
export class SanphamController {
  constructor(private readonly sanphamService: SanphamService) { }

  // Láº¥y danh sÃ¡ch sáº£n pháº©m
  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('includeSizes') includeSizes?: string,
    @Query('includeTenDM') includeTenDM?: string,
    @Query('loaiDM') loaiDM?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('orderByField') orderByField?: keyof Prisma.SANPHAMOrderByWithRelationInput,
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
  ) {
    const allowedOrderByFields: (keyof Prisma.SANPHAMOrderByWithRelationInput)[] =
      ['TenSP', 'GiaBan', 'created_at', 'updated_at', 'TrangThai'];

    const validatedOrderByField = orderByField && allowedOrderByFields.includes(orderByField)
      ? orderByField
      : undefined;

    const params = {
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 50,
      includeSizes: includeSizes === 'true',
      includeTenDM,
      loaiDM,
      search,
      status: status || 'active',
      orderBy:
        validatedOrderByField && orderByDirection
          ? { field: validatedOrderByField, direction: orderByDirection }
          : undefined,
    };

    return this.sanphamService.sanphams(params);
  }

  // Lay san pham theo slug
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.sanphamService.sanpham(slug);
  }

  @Get('related/:slug')
  async findRelated(@Param('slug') slug: string) {
    return await this.sanphamService.findRelated(slug);
  }

  // Táº¡o sáº£n pháº©m
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post()
  async create(@Body() data: SanPhamDto) {
    return await this.sanphamService.createSanpham(data);
  }

  // Cáº­p nháº­t sáº£n pháº©m
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: SanPhamDto) {
    return await this.sanphamService.updateSanPham({
      where: { MaSP: id },
      data,
    });
  }

  // Thay Ä‘á»•i tráº¡ng thÃ¡i sáº£n pháº©m
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Patch('trangthai/:id')
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { TrangThai: 'ACTIVE' | 'INACTIVE' },
  ) {
    return await this.sanphamService.updateSanPham({
      where: { MaSP: id },
      data: { TrangThai: body.TrangThai } as SanPhamDto,
    });
  }
}
