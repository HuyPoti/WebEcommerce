import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, TrangThaiDonHang } from '@prisma/client';

@Injectable()
export class TinhtrangDonhangRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Táº¡o tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng má»›i
  async createOrderStatus(data: {
    MaDH: string;
    TrangThai: string;
  }) {
    return await this.prisma.tINHTRANGDONHANG.create({
      data: {
        MaDH: data.MaDH,
        TrangThai: data.TrangThai as any,
      },
      include: {
        DONHANG: {
          include: {
            KHACHHANG_ACCOUNT: {
              select: {
                MaTK: true,
                Username: true,
              },
            },
          },
        },
      },
    });
  }

  // TÃ¬m tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng theo ID
  async findOrderStatusById(MaTTDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findUnique({
      where: { MaTTDH },
      include: {
        DONHANG: {
          include: {
            KHACHHANG_ACCOUNT: {
              select: {
                MaTK: true,
                Username: true,
              },
            },
          },
        },
      },
    });
  }

  // Láº¥y táº¥t cáº£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng (cÃ³ lá»c)
  async findAllOrderStatuses(filters?: {
    MaDH?: string;
    TrangThai?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.TINHTRANGDONHANGWhereInput = {};

    if (filters?.MaDH) {
      where.MaDH = filters.MaDH;
    }

    if (filters?.TrangThai) {
      where.TrangThai = filters.TrangThai as any;
    }

    const [statuses, total] = await Promise.all([
      this.prisma.tINHTRANGDONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          DONHANG: {
            include: {
              KHACHHANG_ACCOUNT: {
                select: {
                  MaTK: true,
                  Username: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.tINHTRANGDONHANG.count({ where }),
    ]);

    return { statuses, total };
  }

  // Láº¥y lá»‹ch sá»­ tráº¡ng thÃ¡i cá»§a má»™t Ä‘Æ¡n hÃ ng
  async getOrderStatusHistory(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findMany({
      where: { MaDH },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        DONHANG: {
          select: {
            MaDH: true,
            TongTien: true,
            created_at: true,
          },
        },
      },
    });
  }

  // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i cá»§a Ä‘Æ¡n hÃ ng
  async getCurrentOrderStatus(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findFirst({
      where: { MaDH },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        DONHANG: true,
      },
    });
  }

  // Cáº­p nháº­t tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng (thá»±c cháº¥t lÃ  táº¡o má»›i)
  async updateOrderStatus(MaDH: string, TrangThai: string) {
    return await this.createOrderStatus({ MaDH, TrangThai });
  }

  // XÃ³a tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng
  async deleteOrderStatus(MaTTDH: string) {
    return await this.prisma.tINHTRANGDONHANG.delete({
      where: { MaTTDH },
    });
  }

  // XÃ³a táº¥t cáº£ tÃ¬nh tráº¡ng cá»§a má»™t Ä‘Æ¡n hÃ ng
  async deleteAllOrderStatuses(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.deleteMany({
      where: { MaDH },
    });
  }

  // Láº¥y thá»‘ng kÃª tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
  async getOrderStatusStatistics() {
    const [
      total,
      chuaGiao,
      dangGiao,
      daGiao,
      huy,
      loi,
      xacNhanLoi,
    ] = await Promise.all([
      // Tá»•ng sá»‘ Ä‘Æ¡n hÃ ng (Ä‘áº¿m distinct MaDH)
      this.prisma.dONHANG.count(),
      
      // ÄÆ¡n hÃ ng chÆ°a giao
      this.prisma.dONHANG.count({
        where: {
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
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'HUY' as any,
            },
          },
        },
      }),
      
      // ÄÆ¡n hÃ ng lá»—i
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'LOI' as any,
            },
          },
        },
      }),
      
      // ÄÆ¡n hÃ ng xÃ¡c nháº­n lá»—i
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'XAC_NHAN_LOI' as any,
            },
          },
        },
      }),
    ]);

    return {
      total,
      chuaGiao,
      dangGiao,
      daGiao,
      huy,
      loi,
      xacNhanLoi,
    };
  }

  // Kiá»ƒm tra Ä‘Æ¡n hÃ ng tá»“n táº¡i
  async orderExists(MaDH: string): Promise<boolean> {
    const count = await this.prisma.dONHANG.count({
      where: { MaDH },
    });
    return count > 0;
  }

  // Láº¥y thÃ´ng tin Ä‘Æ¡n hÃ ng
  async getOrder(MaDH: string) {
    return await this.prisma.dONHANG.findUnique({
      where: { MaDH },
      include: {
        KHACHHANG_ACCOUNT: {
          select: {
            MaTK: true,
            Username: true,
          },
        },
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
