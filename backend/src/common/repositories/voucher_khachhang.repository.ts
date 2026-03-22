import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TrangThai } from 'src/common/constant';
@Injectable()
export class VoucherKhachHangRepository {
  constructor(private readonly prisma: PrismaService) {}
  //sá»­ dá»¥ng voucher cho khÃ¡ch hÃ ng
  async useVoucher(MaKH: string, MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.update({
      where: { MaVCKH },
      data: {
        TrangThai: TrangThai.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
  //xem danh sÃ¡ch voucher cá»§a khÃ¡ch hÃ ng
  async findAll(MaTKKH: string) {
    const user = await this.prisma.tAIKHOAN.findFirst({
      where: { MaTK: MaTKKH },
    });
    return await this.prisma.vOUCHER_KHACHHANG.findMany({
      where: { MaTKKH: user?.MaTK },
      //orderBy: { created_at: 'desc' },
    });
  }
  //xem chi tiáº¿t voucher khÃ¡ch hÃ ng
  async findById(MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findUnique({
      where: { MaVCKH },
    });
  }
  async findByVoucherAndUser(MaVC: string, MaTK: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findFirst({
      where: { MaVoucher: MaVC, MaTKKH: MaTK },
    });
  }
  //thÃªm voucher khÃ¡ch hÃ ng
  async add(MaTKKH: string, MaVoucher: string) {
    return await this.prisma.vOUCHER_KHACHHANG.create({
      data: {
        MaTKKH,
        MaVoucher,
        TrangThai: TrangThai.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        Hsd: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Háº¡n sá»­ dá»¥ng 1 thÃ¡ng tá»« ngÃ y táº¡o
      },
    });
  }

  //tÃ¬m kiáº¿m voucher Ä‘Ã£ Ä‘Æ°á»£c thÃªm cho khÃ¡ch hÃ ng
  async findVoucherForCustomer(MaTKKH: string, MaVoucher: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findFirst({
      where: { MaTKKH, MaVoucher },
    });
  }

  //cáº­p nháº­t tráº¡ng thÃ¡i voucher khÃ¡ch hÃ ng
  async updateVoucherStatus(MaVoucher: string, status: TrangThai) {
    return await this.prisma.vOUCHER_KHACHHANG.updateMany({
      where: { MaVoucher },
      data: {
        TrangThai: status,
        updated_at: new Date(),
      },
    });
  }
  async inactiveVoucherStatus(MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.update({
      where: { MaVCKH },
      data: {
        TrangThai: TrangThai.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
}
