import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GiohangRepository {
  constructor(private readonly prisma: PrismaService) { }
  //táº¡o giá» hÃ ng
  // TÃ¬m giá» hÃ ng theo MaTKKH
  async findCartByUserId(MaTKKH: string) {
    return await this.prisma.gIOHANG.findFirst({
      where: { MaTKKH },
      select: {
        MaGH: true,
        MaTKKH: true,
        CHITIETGIOHANG: {
          select: {
            MaCTGH: true,
            SoLuong: true,
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
                    HinhAnh: true,
                    slug: true,
                    MauSac: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // TÃ¬m giá» hÃ ng theo MaGH
  async findCartById(MaGH: string) {
    return await this.prisma.gIOHANG.findUnique({
      where: { MaGH },
      select: {
        MaGH: true,
        MaTKKH: true,
        CHITIETGIOHANG: {
          select: {
            MaCTGH: true,
            SoLuong: true,
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
                    HinhAnh: true,
                    slug: true,
                    MauSac: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Táº¡o giá» hÃ ng má»›i
  async createCart(data: { MaTKKH: string }) {
    return await this.prisma.gIOHANG.create({
      data,
      select: {
        MaGH: true,
        MaTKKH: true,
        CHITIETGIOHANG: {
          select: {
            MaCTGH: true,
            SoLuong: true,
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
                    HinhAnh: true,
                    slug: true,
                    MauSac: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // XÃ³a giá» hÃ ng
  // async deleteCart(MaGH: string) {
  //   return await this.prisma.gIOHANG.delete({
  //     where: { MaGH },
  //   });
  // }

  // TÃ¬m chi tiáº¿t giá» hÃ ng theo MaCTGH
  async findCartItemById(MaCTGH: string) {
    return await this.prisma.cHITIETGIOHANG.findUnique({
      where: { MaCTGH },
      select: {
        MaCTGH: true,
        MaGH: true,
        MaCTSP: true,
        SoLuong: true,
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
                HinhAnh: true,
                slug: true,
                MauSac: true,
              },
            },
          },
        },
        GIOHANG: true,
      },
    });
  }

  // TÃ¬m chi tiáº¿t giá» hÃ ng theo MaGH vÃ  MaCTSP
  async findCartItemByProductDetail(MaGH: string, MaCTSP: string) {
    return await this.prisma.cHITIETGIOHANG.findFirst({
      where: {
        MaGH,
        MaCTSP,
      },
      select: {
        MaCTGH: true,
        MaGH: true,
        MaCTSP: true,
        SoLuong: true,
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
                HinhAnh: true,
                slug: true,
                MauSac: true,
              },
            },
          },
        },
      },
    });
  }

  // Láº¥y táº¥t cáº£ sáº£n pháº©m trong giá» hÃ ng
  async findAllCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      select: {
        MaCTGH: true,
        MaGH: true,
        MaCTSP: true,
        SoLuong: true,
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
                HinhAnh: true,
                slug: true,
                MauSac: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // ThÃªm sáº£n pháº©m vÃ o giá» hÃ ng
  async createCartItem(data: { MaGH: string; MaCTSP: string; SoLuong: number }) {
    return await this.prisma.cHITIETGIOHANG.create({
      data,
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });
  }

  // Cáº­p nháº­t sá»‘ lÆ°á»£ng sáº£n pháº©m trong giá»
  async updateCartItemQuantity(MaCTGH: string, SoLuong: number) {
    return await this.prisma.cHITIETGIOHANG.update({
      where: { MaCTGH },
      data: { SoLuong },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });
  }

  // XÃ³a sáº£n pháº©m khá»i giá» hÃ ng
  async deleteCartItem(MaCTGH: string) {
    return await this.prisma.cHITIETGIOHANG.delete({
      where: { MaCTGH },
    });
  }

  // XÃ³a táº¥t cáº£ sáº£n pháº©m trong giá» hÃ ng
  async deleteAllCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.deleteMany({
      where: { MaGH },
    });
  }

  // Äáº¿m sá»‘ lÆ°á»£ng sáº£n pháº©m trong giá»
  async countCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.count({
      where: { MaGH },
    });
  }

  // TÃ­nh tá»•ng giÃ¡ trá»‹ giá» hÃ ng
  async calculateCartTotal(MaGH: string) {
    const items = await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });

    return items.reduce(
      (acc, item) => {
        return {
          totalQuantity: acc.totalQuantity + item.SoLuong,
          totalValue:
            acc.totalValue +
            item.SoLuong * Number(item.CHITIETSANPHAM.SANPHAM.GiaBan),
        };
      },
      { totalQuantity: 0, totalValue: 0 },
    );
  }

  // Kiá»ƒm tra tá»“n kho trÆ°á»›c khi checkout
  async validateStockForCheckout(MaGH: string) {
    const items = await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });

    const outOfStockItems = items.filter(
      (item) => item.CHITIETSANPHAM.SoLuong < item.SoLuong,
    );

    return {
      isValid: outOfStockItems.length === 0,
      outOfStockItems: outOfStockItems.map((item) => ({
        MaCTGH: item.MaCTGH,
        TenSP: item.CHITIETSANPHAM.SANPHAM.TenSP,
        requestedQuantity: item.SoLuong,
        availableQuantity: item.CHITIETSANPHAM.SoLuong,
      })),
    };
  }
}
