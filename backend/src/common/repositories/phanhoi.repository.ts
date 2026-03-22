import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class PhanHoiRepository {
  constructor(private readonly prisma: PrismaService) { }
  //láº¥y danh sÃ¡ch pháº£n há»“i theo sáº£n pháº©m
  async findAll(MaSP: string) {
    return await this.prisma.pHANHOI.findMany({
      where: { MaSP },
      orderBy: { created_at: 'desc' },
    });
  }
  async findAllCustomer(MaTKKH: string[]) {
    const feedbacksCustomer = await this.prisma.tAIKHOAN.findMany({
      where: { MaTK: { in: MaTKKH } },
      orderBy: { created_at: 'desc' },
    });
    return feedbacksCustomer.map((fb) => fb.Username);
  }
  //xem chi tiáº¿t pháº£n há»“i
  async findById(MaPH: string) {
    return await this.prisma.pHANHOI.findUnique({
      where: { MaPH: MaPH },
    });
  }
  //chá»‰nh sá»­a pháº£n há»“i
  async update(MaPH: string, MaTKKH: string, updateData: any) {
    return await this.prisma.pHANHOI.updateMany({
      where: { MaPH, MaTKKH },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });
  }
  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m
  async getCustomerFeedback(MaSP: string, MaTKKH: string) {
    return await this.prisma.pHANHOI.findFirst({
      where: { MaSP, MaTKKH },
      orderBy: { created_at: 'desc' },
    });
  }
  //xÃ³a pháº£n há»“i
  async delete(MaPH: string) {
    return await this.prisma.pHANHOI.delete({
      where: { MaPH },
    });
  }

  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m cho nhÃ¢n viÃªn
  async getCustomerFeedbackForNV() {
    return await this.prisma.pHANHOI.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        MaPH: true,
        BinhLuan: true,
        SoSao: true,
        created_at: true,
        updated_at: true,
        MaSP: true,
        MaTKKH: true,
        SANPHAM: {
          select: {
            TenSP: true,
          },
        },
        TAIKHOAN: {
          select: {
            Username: true,
          },
        },
      },
    });
  }
}
