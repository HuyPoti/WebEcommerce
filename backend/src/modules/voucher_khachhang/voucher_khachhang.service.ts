import { BadRequestException, Injectable } from '@nestjs/common';
import { VoucherRepository } from 'src/common/repositories/voucher.repository';
import { VoucherKhachHangRepository } from 'src/common/repositories/voucher_khachhang.repository';
import { LoaiVoucher, TrangThai } from 'src/common/constant';
@Injectable()
export class VoucherKhachHangService {
  constructor(
    private readonly voucherKhachHangRepository: VoucherKhachHangRepository,
    private readonly voucherRepository: VoucherRepository,
  ) {}
  //sá»­ dá»¥ng voucher cho khÃ¡ch hÃ ng
  async useVoucher(MaKH: string, MaVCKH: string) {
    return await this.voucherKhachHangRepository.useVoucher(MaKH, MaVCKH);
  }
  //xem danh sÃ¡ch voucher khÃ¡ch hÃ ng
  async findAll(MaAuth: string) {
    //kiá»ƒm tra náº¿u mÃ£ voucher á»Ÿ báº£ng voucher mÃ  á»Ÿ tráº¡ng thÃ¡i INACTIVE thÃ¬ chuyá»ƒn cÃ¡c voucher Ä‘Ã³ vá» tráº¡ng thÃ¡i INACTIVE vÃ  ngÆ°á»£c láº¡i
    const vouchers = await this.voucherKhachHangRepository.findAll(MaAuth);
    if (!vouchers) {
      throw new Error('KhÃ´ng tÃ¬m tháº¥y voucher cho khÃ¡ch hÃ ng nÃ y');
    }
    // console.log('vouchers', vouchers);
    for (const voucher of vouchers) {
      const checkVoucher = await this.voucherRepository.getVoucherById(
        voucher.MaVoucher,
      );
      if (checkVoucher) {
        // Náº¿u voucher tá»“n táº¡i, kiá»ƒm tra tráº¡ng thÃ¡i
        if (checkVoucher.TrangThai === 'INACTIVE') {
          await this.voucherKhachHangRepository.updateVoucherStatus(
            voucher.MaVoucher,
            TrangThai.INACTIVE,
          );
        }
      }
      voucher['voucherDetails'] = checkVoucher; // GÃ¡n thÃ´ng tin chi tiáº¿t voucher vÃ o Ä‘á»‘i tÆ°á»£ng voucher khÃ¡ch hÃ ng
    }
    return vouchers;
  }
  //xem chi tiáº¿t voucher khÃ¡ch hÃ ng
  async findById(MaVCKH: string) {
    const voucher = await this.voucherKhachHangRepository.findById(MaVCKH);
    if (!voucher) {
      throw new Error('KhÃ´ng tÃ¬m tháº¥y voucher cho khÃ¡ch hÃ ng nÃ y');
    }
    const voucherDetails = await this.voucherRepository.getVoucherById(
      voucher.MaVoucher,
    );
    if (voucherDetails) {
      // Gá»™p thÃ´ng tin chi tiáº¿t voucher vÃ o Ä‘á»‘i tÆ°á»£ng voucher khÃ¡ch hÃ ng
      Object.assign(voucher, { voucherDetails });
    }
    return voucher;
  }
  //thÃªm voucher khÃ¡ch hÃ ng
  async add(MaKH: string, MaVoucher: string) {
    //kiá»ƒm tra mÃ£ voucher cÃ³ tá»“n táº¡i trong báº£ng voucher khÃ´ng
    const checkVoucher = await this.voucherRepository.getVoucherById(MaVoucher);
    if (!checkVoucher) {
      throw new BadRequestException('Voucher khÃ´ng tá»“n táº¡i');
    }
    //kiá»ƒm tra voucher cÃ³ trong thá»i háº¡n táº·ng khÃ´ng
    if (checkVoucher.SoLuong <= 0) {
      throw new BadRequestException('Voucher Ä‘Ã£ háº¿t sá»‘ lÆ°á»£ng');
    }
    const currentDate = new Date();
    if (
      checkVoucher.NgayBatDau > currentDate ||
      checkVoucher.NgayKetThuc < currentDate
    ) {
      throw new BadRequestException('Voucher khÃ´ng trong thá»i háº¡n nháº­n');
    }

    if (checkVoucher.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher khÃ´ng kháº£ dá»¥ng');
    }

    //tÃ¬m kiáº¿m voucher Ä‘Ã£ Ä‘Æ°á»£c thÃªm cho khÃ¡ch hÃ ng chÆ°a
    const existingVoucherForCustomer =
      await this.voucherKhachHangRepository.findVoucherForCustomer(
        MaKH, checkVoucher.MaVoucher,
      );
    if (existingVoucherForCustomer) {
      throw new BadRequestException('Báº¡n Ä‘Ã£ sá»Ÿ há»¯u voucher nÃ y');
    }
    //trá»« Ä‘i sá»‘ lÆ°á»£ng voucher trong báº£ng voucher
    const decreaseAmount = await this.voucherRepository.updateVoucher(checkVoucher.MaVoucher, {
      SoLuong: checkVoucher.SoLuong - 1,
    });
    return await this.voucherKhachHangRepository.add(MaKH, checkVoucher.MaVoucher);
  }

  //kiá»ƒm tra voucher
  async check(MaVCKH: string, finalTotal: number) {
    const voucherKH = await this.voucherKhachHangRepository.findById(MaVCKH);
    if (!voucherKH) {
      throw new BadRequestException('Báº¡n khÃ´ng sá»Ÿ há»¯u voucher nÃ y');
    } 
    if (voucherKH.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng hoáº·c khÃ´ng kháº£ dá»¥ng');
    }
    if (voucherKH.Hsd < new Date()) {
      throw new BadRequestException('Voucher Ä‘Ã£ háº¿t háº¡n sá»­ dá»¥ng');
    }
    const voucherDetails = await this.voucherRepository.getVoucherById(
      voucherKH.MaVoucher,
    );
    if (voucherDetails?.Loai == LoaiVoucher.GiamGia) {
      if (voucherDetails.Dieukien && voucherDetails.Dieukien > finalTotal) {
        throw new BadRequestException(`ÄÆ¡n hÃ ng chÆ°a Ä‘áº¡t Ä‘iá»u kiá»‡n sá»­ dá»¥ng voucher. ÄÆ¡n tá»‘i thiá»ƒu: ${voucherDetails.Dieukien}`);
      }
      return {MaVoucher: voucherKH.MaVoucher, type: 'GiamGia', value: voucherDetails.SoTien  };
    }
    return { MaVoucher: voucherKH.MaVoucher, type: 'FreeShip', value: 0 };
  }

  //thay Ä‘á»•i tráº¡ng thÃ¡i voucher khÃ¡ch hÃ ng
  async inactiveStatus(MaVC: string, MaTK: string) {
    const voucherKH = await this.voucherKhachHangRepository.findByVoucherAndUser(MaVC, MaTK);
    console.log('voucherKH', voucherKH);
    console.log('MaVC, MaTK', MaVC, MaTK);
    if (!voucherKH) {
      throw new BadRequestException('Báº¡n khÃ´ng sá»Ÿ há»¯u voucher nÃ y');
    } 
    if (voucherKH.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng hoáº·c khÃ´ng kháº£ dá»¥ng');
    }
    return await this.voucherKhachHangRepository.inactiveVoucherStatus(voucherKH.MaVCKH);
  }
}
