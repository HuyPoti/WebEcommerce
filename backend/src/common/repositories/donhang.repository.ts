import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateDonhangDto,
  CreateDonhangStatusDto,
} from 'src/modules/donhang/dto/donhang.dto';

@Injectable()
export class DonhangRepository {
  constructor(private readonly prisma: PrismaService) { }

  // Táº¡o Ä‘Æ¡n hÃ ng má»›i
  async createOrder(data: CreateDonhangDto) {
    return await this.prisma.dONHANG.create({
      data: {
        MaDH: data.MaDH,
        SoLuong: data.SoLuong,
        TongTien: data.TongTien,
        TenNM: data.TenNM,
        SoDienThoai: data.SoDienThoai,
        DiaChi: data.DiaChi,
        MaCTSP: data.MaCTSP,
        MaTK_KH: data.MaTK_KH,
        MaVoucher: data.MaVoucher,
        MaSK: data.MaSK,
        // Táº¡o tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng ban Ä‘áº§u
        TINHTRANGDONHANG: {
          create: {
            TrangThai: 'CHUA_GIAO',
          },
        },
      },
      select: {
        MaDH: true,
        created_at: true,
        SoLuong: true,
        TongTien: true,
        TenNM: true,
        SoDienThoai: true,
        DiaChi: true,
        MaCTSP: true,
        MaTK_KH: true,
        MaVoucher: true,
        MaSK: true,
        CHITIETSANPHAM: {
          select: {
            MaCTSP: true,
            KichCo: true,
            SoLuong: true,
            SANPHAM: {
              select: {
                MaSP: true,
                TenSP: true,
                GiaBan: true,
                MoTa: true,
                MauSac: true,
                HinhAnh: true,
              },
            },
          },
        },
        VOUCHER: true,
        SUKIENUUDAI: true,
        KHACHHANG_ACCOUNT: true,
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  // TÃ¬m Ä‘Æ¡n hÃ ng theo ID
  async findOrderById(MaDH: string) {
    return await this.prisma.dONHANG.findUnique({
      where: { MaDH },
      select: {
        MaDH: true,
        created_at: true,
        SoLuong: true,
        TongTien: true,
        TenNM: true,
        SoDienThoai: true,
        DiaChi: true,
        MaCTSP: true,
        MaTK_KH: true,
        MaVoucher: true,
        MaSK: true,
        CHITIETSANPHAM: {
          select: {
            MaCTSP: true,
            KichCo: true,
            SoLuong: true,
            SANPHAM: {
              select: {
                MaSP: true,
                TenSP: true,
                GiaBan: true,
                MoTa: true,
                MauSac: true,
                HinhAnh: true,
              },
            },
          },
        },
        VOUCHER: true,
        SUKIENUUDAI: true,
        KHACHHANG_ACCOUNT: {
          select: {
            MaTK: true,
            Username: true,
            Avatar: true,
          },
        },
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  async findAllOrdersForCustomer(filters?: {
    MaTK_KH?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.DONHANGWhereInput = {};

    if (filters?.MaTK_KH) {
      where.MaTK_KH = filters.MaTK_KH;
    }

    const [orders, total] = await Promise.all([
      this.prisma.dONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          MaDH: true,
          created_at: true,
          SoLuong: true,
          TongTien: true,
          MaCTSP: true,
          MaTK_KH: true,
          CHITIETSANPHAM: {
            select: {
              MaCTSP: true,
              KichCo: true,
              SoLuong: true,
              SANPHAM: {
                select: {
                  MaSP: true,
                  TenSP: true,
                  GiaBan: true,
                  MoTa: true,
                  MauSac: true,
                  HinhAnh: true,
                },
              },
            },
          },
          TINHTRANGDONHANG: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
      }),
      this.prisma.dONHANG.count({ where }),
    ]);

    return { orders, total };
  }

  // Láº¥y táº¥t cáº£ Ä‘Æ¡n hÃ ng cá»§a khÃ¡ch hÃ ng Ä‘Ã³ <nhÃ¢n viÃªn chÄƒm sÃ³c khÃ¡ch hÃ ng> (cÃ³ thá»ƒ lá»c theo khÃ¡ch hÃ ng)
  async findAllOrdersForStaff(filters?: { skip?: number; take?: number }) {
    const where: Prisma.DONHANGWhereInput = {};

    const [orders] = await Promise.all([
      this.prisma.dONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          MaDH: true,
          created_at: true,
          SoLuong: true,
          TongTien: true,
          MaCTSP: true,
          MaTK_KH: true,
          CHITIETSANPHAM: {
            select: {
              MaCTSP: true,
              KichCo: true,
              SoLuong: true,
              SANPHAM: {
                select: {
                  MaSP: true,
                  TenSP: true,
                  GiaBan: true,
                  MoTa: true,
                  MauSac: true,
                  HinhAnh: true,
                },
              },
            },
          },
          TINHTRANGDONHANG: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      }),
    ]);

    return orders;
  }

  // Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
  async updateOrderStatus(MaDH: string, TrangThai: string) {
    // Táº¡o báº£n ghi tráº¡ng thÃ¡i má»›i
    await this.prisma.tINHTRANGDONHANG.create({
      data: {
        TrangThai: TrangThai as any,
        MaDH,
      },
    });

    // Tráº£ vá» Ä‘Æ¡n hÃ ng vá»›i tráº¡ng thÃ¡i má»›i nháº¥t
    return await this.findOrderById(MaDH);
  }

  // XÃ³a Ä‘Æ¡n hÃ ng (soft delete - cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh HUY)
  async cancelOrder(MaDH: string) {
    return await this.updateOrderStatus(MaDH, 'HUY');
  }

  // XÃ³a Ä‘Æ¡n hÃ ng hoÃ n toÃ n (hard delete)
  async deleteOrder(MaDH: string) {
    // XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng trÆ°á»›c
    await this.prisma.tINHTRANGDONHANG.deleteMany({
      where: { MaDH },
    });

    // XÃ³a Ä‘Æ¡n hÃ ng
    return await this.prisma.dONHANG.delete({
      where: { MaDH },
    });
  }

  // Láº¥y chi tiáº¿t sáº£n pháº©m Ä‘á»ƒ tÃ­nh giÃ¡
  async getProductDetail(MaCTSP: string) {
    return await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
      // include: {
      //   SANPHAM: true,
      // },
    });
  }

  // Láº¥y thÃ´ng tin voucher
  // async getVoucher(MaVoucher: string) {
  //   return await this.prisma.vOUCHER.findUnique({
  //     where: { MaVoucher },
  //   });
  // }

  // // Láº¥y thÃ´ng tin sá»± kiá»‡n Æ°u Ä‘Ã£i
  // async getPromotion(MaSK: string) {
  //   return await this.prisma.sUKIENUUDAI.findUnique({
  //     where: { MaSK },
  //   });
  // }

  // Cáº­p nháº­t sá»‘ lÆ°á»£ng sáº£n pháº©m trong kho
  async updateProductStock(MaCTSP: string, quantity: number) {
    const currentProduct = await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
    });

    if (!currentProduct) {
      throw new Error('KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m');
    }

    const newQuantity = currentProduct.SoLuong - quantity;

    return await this.prisma.cHITIETSANPHAM.update({
      where: { MaCTSP },
      data: {
        SoLuong: newQuantity,
        TrangThaiSP: newQuantity <= 0 ? 'HET_HANG' : currentProduct.TrangThaiSP,
      },
    });
  }

  // KhÃ´i phá»¥c sá»‘ lÆ°á»£ng sáº£n pháº©m khi há»§y Ä‘Æ¡n
  async restoreProductStock(MaCTSP: string, quantity: number) {
    const currentProduct = await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
    });

    if (!currentProduct) {
      throw new Error('KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m');
    }

    const newQuantity = currentProduct.SoLuong + quantity;

    return await this.prisma.cHITIETSANPHAM.update({
      where: { MaCTSP },
      data: {
        SoLuong: newQuantity,
        TrangThaiSP: newQuantity > 0 ? 'CON_HANG' : currentProduct.TrangThaiSP,
      },
    });
  }

  // Láº¥y tá»•ng há»£p Ä‘Æ¡n hÃ ng theo tráº¡ng thÃ¡i
  async getOrderSummary(MaTK_KH?: string) {
    const where: Prisma.DONHANGWhereInput = {};

    if (MaTK_KH) {
      where.MaTK_KH = MaTK_KH;
    }

    const [
      totalOrders,
      processingOrders,
      shippingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      // Tá»•ng sá»‘ Ä‘Æ¡n hÃ ng
      this.prisma.dONHANG.count({ where }),

      // ÄÆ¡n hÃ ng chÆ°a giao
      this.prisma.dONHANG.count({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'CHUA_GIAO' as any,
            },
          },
        },
      }),

      // ÄÆ¡n hÃ ng Ä‘ang giao
      this.prisma.dONHANG.count({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DANG_GIAO' as any,
            },
          },
        },
      }),

      // ÄÆ¡n hÃ ng Ä‘Ã£ giao
      this.prisma.dONHANG.count({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DA_GIAO' as any,
            },
          },
        },
      }),

      // ÄÆ¡n hÃ ng Ä‘Ã£ há»§y
      this.prisma.dONHANG.count({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'HUY',
            },
          },
        },
      }),

      // Tá»•ng doanh thu (chá»‰ tÃ­nh Ä‘Æ¡n Ä‘Ã£ giao)
      this.prisma.dONHANG.aggregate({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DA_GIAO' as any,
            },
          },
        },
        _sum: {
          TongTien: true,
        },
      }),
    ]);

    return {
      totalOrders,
      processingOrders, // CHUA_GIAO
      shippingOrders, // DANG_GIAO
      completedOrders, // DA_GIAO
      cancelledOrders, // HUY
      totalRevenue: totalRevenue._sum.TongTien || 0,
    };
  }

  async addOrderStatus(body: CreateDonhangStatusDto) {
    // ThÃªm tráº¡ng thÃ¡i má»›i
    const newStatus = await this.prisma.tINHTRANGDONHANG.create({
      data: {
        MaDH: body.MaDH,
        TrangThai: body.TrangThai,
      },
    });

    return newStatus;
  }
}
