import { Injectable } from '@nestjs/common';
import { TrangThai } from 'src/common/constant';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class VoucherRepository {
  constructor(private readonly prismaService: PrismaService) {}
  //láº¥y táº¥t cáº£ voucher
  async getAllVouchers() {
    return this.prismaService.vOUCHER.findMany();
  }
  //láº¥y voucher theo id
  async getVoucherById(id: string) {
    return this.prismaService.vOUCHER.findUnique({
      where: { MaVoucher: id },
    });
  }

  //láº¥y voucher theo code
  async getVoucherByCode(code: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { Code: code },
    });
  }

  //láº¥y voucher theo tÃªn
  async getVoucherByName(name: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { TenVoucher: name },
    });
  }
  //thÃªm má»›i voucher
  async addVoucher(newdata: any) {
    return this.prismaService.vOUCHER.create({
      data: newdata,
    });
  }
  //chá»‰nh sá»­a voucher dá»±a trÃªn id lÃ  chuá»—i
  async updateVoucher(MaVoucher: string, updatedata: any) {
    return this.prismaService.vOUCHER.update({
      where: { MaVoucher },
      data: updatedata,
    });
  }
  //thay Ä‘á»•i tráº¡ng thÃ¡i biáº¿t tráº¡ng thÃ¡i lÃ  kiá»ƒu enum
  async changeStatus(MaVoucher: string, TrangThai: TrangThai) {
    return this.prismaService.vOUCHER.update({
      where: { MaVoucher },
      data: {
        TrangThai,
      },
    });
  }
  //kiá»ƒm tra mÃ£ voucher
  async checkVoucherCode(code: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { Code: code },
    });
  }
}
