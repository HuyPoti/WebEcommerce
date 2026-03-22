import { Injectable } from '@nestjs/common';
import { TrangThaiDonHang } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ThongkeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getDoanhThu() {
    // Láº¥y ngÃ y Ä‘áº§u tiÃªn cá»§a thÃ¡ng 12 thÃ¡ng trÆ°á»›c
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 thÃ¡ng trÆ°á»›c, tÃ­nh cáº£ thÃ¡ng hiá»‡n táº¡i
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Äáº§u thÃ¡ng sau (khÃ´ng bao gá»“m)

    const result = await this.prisma.tINHTRANGDONHANG.findMany({
      where: {
        TrangThai: TrangThaiDonHang.DA_GIAO,
        created_at: {
          gte: start,
          lt: end,
        },
      },
      include: {
        DONHANG: {
          select: {
            MaDH: true,
            TongTien: true,
            SoLuong: true,
            created_at: true,
            VOUCHER: {
              select: {
                Loai: true,
                SoTien: true,
              },
            },
            SUKIENUUDAI:{
              select: {
                PhanTramGiam: true,
              }
            },
            CHITIETSANPHAM: {
              select: {
                SANPHAM: {
                  select: {
                    GiaMua: true,
                    GiaBan: true,
                    TenSP: true,
                    DANHMUC: {
                      select: {
                        TenDM: true
                      }
                    }
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  }

  async getSLKhachHang() {
    // Láº¥y ngÃ y Ä‘áº§u tiÃªn cá»§a thÃ¡ng 12 thÃ¡ng trÆ°á»›c
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await this.prisma.tAIKHOAN.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end,
        },
      },
      select: {
        created_at: true,
        MaTK: true,
      },
    });

    return result;
  }
}
