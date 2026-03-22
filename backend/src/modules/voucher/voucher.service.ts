import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VoucherRepository } from 'src/common/repositories/voucher.repository';
import { VoucherDto } from './dto/voucher.dto';
import { TrangThai } from 'src/common/constant';
import { ExcelService } from 'src/modules/voucher/excel.service';
@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly excelService: ExcelService,
  ) {}

  //láº¥y danh sÃ¡ch voucher
  async getAllVouchers() {
    return this.voucherRepository.getAllVouchers();
  }

  //láº¥y voucher theo id
  async getVoucherById(id: string) {
    const existingVoucher = await this.voucherRepository.getVoucherById(id);
    if (!existingVoucher) {
      throw new BadRequestException('KhÃ´ng tÃ¬m tháº¥y voucher');
    }
    return existingVoucher;
  }

  //láº¥y voucher theo mÃ£ code
  async getVoucherByCode(code: string) {
    console.log('code', code);
    const existingVoucher = await this.voucherRepository.getVoucherByCode(code);
    if (!existingVoucher) {
      throw new BadRequestException('KhÃ´ng tÃ¬m tháº¥y voucher');
    }
    return existingVoucher;
  }

  // thÃªm má»›i voucher
  async addVoucher(data: VoucherDto) {
    const existingVoucher = await this.voucherRepository.getVoucherByName(
      data.TenVoucher,
    );
    if (existingVoucher) {
      throw new BadRequestException('TÃªn voucher Ä‘Ã£ tá»“n táº¡i');
    }
    const voucherCode = await this.voucherRepository.checkVoucherCode(
      data.Code,
    );
    if (voucherCode) {
      throw new BadRequestException('MÃ£ code Ä‘Ã£ tá»“n táº¡i');
    }
    return this.voucherRepository.addVoucher(data);
  }

  //chá»‰nh sá»­a voucher theo id
  async updateVoucher(id: string, data: VoucherDto) {
    const existingVoucher = await this.voucherRepository.getVoucherById(id);
    if (!existingVoucher) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y voucher');
    }
    if (data.TenVoucher && data.TenVoucher !== existingVoucher.TenVoucher) {
      const voucherWithSameName = await this.voucherRepository.getVoucherByName(
        data.TenVoucher,
      );
      if (voucherWithSameName) {
        throw new BadRequestException('TÃªn voucher Ä‘Ã£ tá»“n táº¡i');
      }
    }
    return this.voucherRepository.updateVoucher(id, data);
  }

  //thay Ä‘á»•i tráº¡ng thÃ¡i voucher
  async changeStatus(id: string, trangThai: string) {
    const existingVoucher = await this.voucherRepository.getVoucherById(id);
    if (!existingVoucher) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y voucher');
    }
    if (!(trangThai in TrangThai)) {
      throw new BadRequestException('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
    }
    return this.voucherRepository.changeStatus(id, trangThai as TrangThai);
  }
  //xuáº¥t bÃ¡o cÃ¡o excel voucher
  async exportVoucherToExcel(): Promise<Buffer> {
    // Láº¥y dá»¯ liá»‡u voucher tá»« cÆ¡ sá»Ÿ dá»¯ liá»‡u
    const vouchers = await this.voucherRepository.getAllVouchers();
    return this.excelService.generateToExcel(vouchers);
  }
}
