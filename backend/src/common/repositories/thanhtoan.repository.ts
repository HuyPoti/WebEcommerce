import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePaymentDto } from 'src/modules/thanhtoan/dto/thanhtoan.dto';

@Injectable()
export class ThanhtoanRepository {
  constructor(private readonly prismaService: PrismaService) {}
  // CÃ¡c phÆ°Æ¡ng thá»©c truy cáº­p dá»¯ liá»‡u liÃªn quan Ä‘áº¿n thanh toÃ¡n sáº½ Ä‘Æ°á»£c Ä‘á»‹nh nghÄ©a á»Ÿ Ä‘Ã¢y
  async findPaymentDetailById(MaTTDH: string) {
    return await this.prismaService.tHANHTOAN.findUnique({
      where: { MaTTDH },
      include: {
        DONHANG: {
          include: {
            CHITIETSANPHAM: {
              include: {
                SANPHAM: true,
              },
            },
            SUKIENUUDAI: true,
            VOUCHER: true,
          },
        },
      TAIKHOAN: true,
      },

      // ThÃªm cÃ¡c báº£ng liÃªn quan khÃ¡c náº¿u cáº§n
    });
  }
  async findAllPayments() {
    return await this.prismaService.tHANHTOAN.findMany({});
  }
  async createPayment(data: CreatePaymentDto) {
    return await this.prismaService.tHANHTOAN.create({
      data: {
        SoTien: data.SoTien,
        PhuongThuc: data.PhuongThuc,
        MaDH: data.MaDH,
        MaKH: data.MaKH,
        MaGD: data.MaGD,
      },
      include: {
        DONHANG: true,
        TAIKHOAN: true,
      },
    });
  }
}
