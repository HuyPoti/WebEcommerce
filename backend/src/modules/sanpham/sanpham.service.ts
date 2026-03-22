import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoaiDanhMuc, Prisma, KichCo } from '@prisma/client';
import { SanPhamDto } from './dto/sanpham.dto';
import { stat } from 'fs';

export interface SANPHAM {
  MaSP: string;
  created_at: Date;
  updated_at: Date;
  MoTa: string | null;
  TenSP: string;
  HinhAnh: string[];
  GiaBan: number;
  GiaMua: number;
  TrangThai: 'ACTIVE' | 'INACTIVE';
  MaDM: string;
  MauSac: string;
  slug: string;
}
interface SanphamsParams {
  skip?: number;
  take?: number;
  includeSizes?: boolean;
  includeTenDM?: string;
  loaiDM?: string;
  orderBy?: {
    field: keyof Prisma.SANPHAMOrderByWithRelationInput;
    direction: 'asc' | 'desc';
  };
  search?: string;
  status?: string;
}
@Injectable()
export class SanphamService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
  ) { }

  // Lay san pham theo ID
  async sanpham(slug: string): Promise<any | null> {
    return this.prisma.sANPHAM.findFirst({
      where: { slug: slug },
      select: {
        MaSP: true,
        created_at: true,
        updated_at: true,
        MoTa: true,
        TenSP: true,
        HinhAnh: true,
        GiaBan: true,
        GiaMua: true,
        TrangThai: true,
        MaDM: true,
        MauSac: true,
        slug: true,
        CHITIETSANPHAM: {
          select: { MaCTSP: true, SoLuong: true, KichCo: true },
        },
      },
    });
  }

  async sanphams(params: SanphamsParams): Promise<any[]> {
    const {
      skip = 0,
      take = 50,
      includeSizes = false,
      includeTenDM = '',
      loaiDM = '',
      search = '',
      status = '',
      orderBy,
    } = params;

    const where: Prisma.SANPHAMWhereInput = {};
    // CATEGORY FILTER
    const tenCacDM = includeTenDM
      ? decodeURIComponent(includeTenDM)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

    if (tenCacDM.length > 0) {
      where.DANHMUC = {
        TenDM: { in: tenCacDM },
        Loai: loaiDM ? (loaiDM as LoaiDanhMuc) : undefined,
      };
    }

    // STATUS FILTER
    if (status === 'active') where.TrangThai = 'ACTIVE';
    if (status === 'inactive') where.TrangThai = 'INACTIVE';

    // SEARCH FILTER
    if (search.trim()) {
      const s = search.trim();

      const ALL_SIZES = Object.values(KichCo);
      const matchedSize = ALL_SIZES.find(
        (size) => size.toLowerCase() === s.toLowerCase(),
      );

      const orFilters: Prisma.SANPHAMWhereInput[] = [];

      orFilters.push({
        TenSP: { contains: s, mode: 'insensitive' },
      });

      orFilters.push({
        MauSac: { contains: s, mode: 'insensitive' },
      });

      orFilters.push({
        DANHMUC: {
          TenDM: { contains: s, mode: 'insensitive' },
        },
      });

      if (matchedSize) {
        orFilters.push({
          CHITIETSANPHAM: {
            some: { KichCo: { equals: matchedSize } },
          },
        });
      }

      if (orFilters.length > 0) {
        where.OR = orFilters;
      }
    }

    // QUERY OPTIONS
    const queryOptions: Prisma.SANPHAMFindManyArgs = {
      skip,
      take,
      where: Object.keys(where).length > 0 ? where : undefined,
      select: includeSizes
        ? {
          MaSP: true,
          created_at: true,
          updated_at: true,
          MoTa: true,
          TenSP: true,
          HinhAnh: true,
          GiaBan: true,
          GiaMua: true,
          TrangThai: true,
          MaDM: true,
          MauSac: true,
          slug: true,
          CHITIETSANPHAM: {
            select: { MaCTSP: true, SoLuong: true, KichCo: true },
          },
          DANHMUC: {
            select: { MaDM: true, TenDM: true, Loai: true },
          },
        }
        : {
          MaSP: true,
          created_at: true,
          updated_at: true,
          MoTa: true,
          TenSP: true,
          HinhAnh: true,
          GiaBan: true,
          GiaMua: true,
          TrangThai: true,
          MaDM: true,
          MauSac: true,
          slug: true,
        },
    };

    if (orderBy) {
      queryOptions.orderBy = { [orderBy.field]: orderBy.direction };
    }

    return await this.prisma.sANPHAM.findMany(queryOptions);
  }

  async findRelated(tenSP: string): Promise<any[]> {
    const product = await this.prisma.sANPHAM.findFirst({
      where: { TenSP: tenSP },
    });
    const relatedProducts = await this.prisma.sANPHAM.findMany({
      take: 10,
      where: {
        MaDM: product?.MaDM,
      },
      select: {
        MaSP: true,
        TenSP: true,
        HinhAnh: true,
        GiaBan: true,
        slug: true,
        MauSac: true,
        MoTa: true,
        CHITIETSANPHAM: {
          select: { MaCTSP: true, SoLuong: true },
        },
      },
    });
    return relatedProducts;
  }
  // Tao san pham moi
  async createSanpham(data: SanPhamDto): Promise<SANPHAM> {
    const payload: Prisma.SANPHAMCreateInput = {
      TenSP: data.TenSP,
      MoTa: data.MoTa,
      HinhAnh: data.HinhAnh,
      GiaBan: data.GiaBan,
      GiaMua: data.GiaMua,
      TrangThai: 'ACTIVE',
      MauSac: data.MauSac,
      DANHMUC: {
        connect: { MaDM: data.MaDM },
      },
      slug: data.slug,
    };

    const product = await this.prisma.sANPHAM.create({ data: payload });

    await this.auditService.log({
      hanhDong: 'CREATE_PRODUCT',
      module: 'SANPHAM',
      chiTiet: `Created product: ${product.TenSP} (${product.MaSP})`,
    });

    return product;
  }

  // Cáº­p nháº­t sáº£n pháº©m
  async updateSanPham(params: {
    where: { MaSP: string };
    data: SanPhamDto;
  }): Promise<SANPHAM> {
    const { where, data } = params;

    const payload: Prisma.SANPHAMUpdateInput = {
      TenSP: data.TenSP,
      MoTa: data.MoTa,
      HinhAnh: data.HinhAnh,
      GiaBan: data.GiaBan,
      MauSac: data.MauSac,
      DANHMUC: {
        connect: { MaDM: data.MaDM },
      },
      slug: data.slug,
    };

    try {
      const result = await this.prisma.sANPHAM.update({
        data: payload,
        where,
      });

      await this.auditService.log({
        hanhDong: 'UPDATE_PRODUCT',
        module: 'SANPHAM',
        chiTiet: `Updated product: ${where.MaSP}`,
      });

      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
      }
      throw error;
    }
  }

  // ðŸ”¹ Service riÃªng Ä‘á»ƒ cáº­p nháº­t tráº¡ng thÃ¡i sáº£n pháº©m
  async updateTrangThaiSanPham(
    MaSP: string,
    trangThai: 'ACTIVE' | 'INACTIVE',
  ): Promise<SANPHAM> {
    try {
      const result = await this.prisma.sANPHAM.update({
        where: { MaSP },
        data: { TrangThai: trangThai },
      });

      await this.auditService.log({
        hanhDong: 'UPDATE_PRODUCT_STATUS',
        module: 'SANPHAM',
        chiTiet: `Product ${MaSP} status changed to ${trangThai}`,
      });

      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
      }
      throw error;
    }
  }
}
