import { Injectable } from '@nestjs/common';
import { PhanHoiRepository } from 'src/common/repositories/phanhoi.repository';
import { PhanHoiDto } from './dto/phanhoi.dto';
import { SanPhamRepository } from 'src/common/repositories/sanpham.repository';
import { PhanHoiMapper } from './entity/phanhoi.mapper';
@Injectable()
export class PhanHoiService {
  constructor(
    private readonly phanHoiRepository: PhanHoiRepository,
    private readonly sanPhamRepository: SanPhamRepository,
  ) {}
  //láº¥y danh sÃ¡ch pháº£n há»“i theo sáº£n pháº©m
  async findAll(slug: string) {
    const exsitingSanPham = await this.sanPhamRepository.findSPBySlug(slug);
    if (!exsitingSanPham) {
      throw new Error('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
    }
    const feedbacks = await this.phanHoiRepository.findAll(
      exsitingSanPham.MaSP,
    );
    const feedbacksCustomer = await this.phanHoiRepository.findAllCustomer(
      feedbacks.map((fb) => fb.MaTKKH),
    );
    if (!feedbacks && !feedbacksCustomer) {
      throw new Error('KhÃ´ng tÃ¬m tháº¥y pháº£n há»“i cho sáº£n pháº©m nÃ y');
    }
    return { feedbacks, feedbacksCustomer };
  }
  //xem chi tiáº¿t pháº£n há»“i
  async findById(MaPH: string) {
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Pháº£n há»“i khÃ´ng tá»“n táº¡i');
    }
    return exsitingPhanHoi;
  }
  //chá»‰nh sá»­a pháº£n há»“i
  async update(MaPH: string, MaTKKH: string, updateData: PhanHoiDto) {
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Pháº£n há»“i khÃ´ng tá»“n táº¡i');
    }
    return await this.phanHoiRepository.update(MaPH, MaTKKH, updateData);
  }
  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m
  async getCustomerFeedback(MaSP: string, MaTKKH: string) {
    const exsitingSanPham = await this.sanPhamRepository.findSPByID(MaSP);
    if (!exsitingSanPham) {
      throw new Error('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
    }
    return await this.phanHoiRepository.getCustomerFeedback(MaSP, MaTKKH);
  }

  //láº¥y pháº£n há»“i cá»§a khÃ¡ch hÃ ng theo sáº£n pháº©m cho nhÃ¢n viÃªn
  async getCustomerFeedbackForNV() {
    return await this.phanHoiRepository.getCustomerFeedbackForNV();
  }
  //xÃ³a pháº£n há»“i
  async delete(MaPH: string) {
    console.log("MaPH in service:", MaPH);
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Pháº£n há»“i khÃ´ng tá»“n táº¡i');
    }
    return await this.phanHoiRepository.delete(MaPH);
  }
}
