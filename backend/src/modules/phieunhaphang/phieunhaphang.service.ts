import { Injectable } from '@nestjs/common';
import { PhieuNhapHangDto } from './dto/phieunhaphang.dto';
import { PhieuNhapHangRepository } from 'src/common/repositories/phieunhaphang.repository';
import { TrangThaiPhieuNhapHang } from '@prisma/client';
@Injectable()
export class PhieuNhapHangService {
  constructor(
    private readonly phieuNhapHangRepository: PhieuNhapHangRepository,
  ) {}
  //láº¥y táº¥t cáº£ phiáº¿u nháº­p hÃ ng
  async findAll() {
    return this.phieuNhapHangRepository.findAll();
  }
  //láº¥y phiáº¿u nháº­p hÃ ng theo id
  async findById(id: string) {
    const phieuNhapHang = await this.phieuNhapHangRepository.findById(id);
    if (!phieuNhapHang) {
      throw new Error('Phiáº¿u nháº­p hÃ ng khÃ´ng tá»“n táº¡i');
    }
    return phieuNhapHang;
  }
  async findByIdNcc(id: string) {
    const phieuNhapHang = await this.phieuNhapHangRepository.findByIdNcc(id);
    console.log('Service - findByIdNcc result:', phieuNhapHang);
    if (!phieuNhapHang) {
      throw new Error('KhÃ´ng tá»“n táº¡i');
    }
    return phieuNhapHang;
  }
  //táº¡o phiáº¿u nháº­p hÃ ng
  async create(data: PhieuNhapHangDto) {
    return this.phieuNhapHangRepository.create(data);
  }
  //cáº­p nháº­t phiáº¿u nháº­p hÃ ng
  async update(id: string, data: PhieuNhapHangDto) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiáº¿u nháº­p hÃ ng khÃ´ng tá»“n táº¡i');
    }
    return this.phieuNhapHangRepository.update(id, data);
  }
  //NhÃ¢n viÃªn xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  async nhanVienXacNhan(id: string, MaTKNVXN: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiáº¿u nháº­p hÃ ng khÃ´ng tá»“n táº¡i');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
    }
    if (existingPhieuNhapHang.TrangThai !== 'NCC_XACNHAN') {
      throw new Error(
        'Phiáº¿u nháº­p hÃ ng pháº£i á»Ÿ tráº¡ng thÃ¡i nhÃ  cung cáº¥p xÃ¡c nháº­n thÃ¬ nhÃ¢n viÃªn má»›i cÃ³ thá»ƒ xÃ¡c nháº­n',
      );
    }
    return this.phieuNhapHangRepository.nhanVienXacNhan(
      id,
      MaTKNVXN,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }
  //NhÃ  cung cáº¥p xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  async nhaCungCapXacNhan(id: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiáº¿u nháº­p hÃ ng khÃ´ng tá»“n táº¡i');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
    }
    if (existingPhieuNhapHang.TrangThai !== 'DANG_CHO') {
      throw new Error(
        'Phiáº¿u nháº­p hÃ ng pháº£i á»Ÿ tráº¡ng thÃ¡i Ä‘ang chá» thÃ¬ nhÃ  cung cáº¥p má»›i cÃ³ thá»ƒ xÃ¡c nháº­n',
      );
    }

    return this.phieuNhapHangRepository.nhaCungCapXacNhan(
      id,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }
  //NhÃ  cung cáº¥p tá»« chá»‘i phiáº¿u nháº­p hÃ ng
  async nhaCungCapTuChoi(id: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiáº¿u nháº­p hÃ ng khÃ´ng tá»“n táº¡i');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
    }
    if (existingPhieuNhapHang.TrangThai !== 'DANG_CHO') {
      throw new Error(
        'Phiáº¿u nháº­p hÃ ng pháº£i á»Ÿ tráº¡ng thÃ¡i Ä‘ang chá» thÃ¬ nhÃ  cung cáº¥p má»›i cÃ³ thá»ƒ tá»« chá»‘i',
      );
    }
    return this.phieuNhapHangRepository.nhaCungCapTuChoi(
      id,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }

  //láº¥y phiáº¿u nháº­p hÃ ng phÃ¢n trang
  async findPaged(params: {
    page: number;
    pageSize: number;
    status?: TrangThaiPhieuNhapHang;
    date?: string;
  }) {
    return this.phieuNhapHangRepository.findPaged(params);
  }
}
