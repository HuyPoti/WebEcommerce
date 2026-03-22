import { Injectable } from '@nestjs/common';
import { ChitietnhaphangRepository } from 'src/common/repositories/chitietnhaphang.repository';

export type CreateCtNhapItem = { MaCTSP: string; SoLuong: number; DonGia: number };

@Injectable()
export class ChitietnhaphangService {
  constructor(private readonly repo: ChitietnhaphangRepository) {}
  // láº¥y chi tiáº¿t nháº­p hÃ ng theo mÃ£ phiáº¿u
  async findByPhieu(MaPNH: string) {
    return this.repo.findByMaPNH(MaPNH);
  }
  // Táº¡o chi tiáº¿t nháº­p hÃ ng cho phiáº¿u
  async createForPhieu(MaPNH: string, items: CreateCtNhapItem[]) {
    return this.repo.createForPhieu(MaPNH, items as any);
  }
  // danh sÃ¡ch cÃ¡c biáº¿n thá»ƒ sáº£n pháº©m
  async listVariants() {
    return this.repo.listVariants();
  }
  // tÃ¬m kiáº¿m biáº¿n thá»ƒ sáº£n pháº©m theo tá»« khÃ³a
  async searchVariants(q: string) {
    return this.repo.searchVariants(q);
  }
  // láº¥y biáº¿n thá»ƒ sáº£n pháº©m theo mÃ£
  async getVariant(MaCTSP: string) {
    return this.repo.findVariantByMaCTSP(MaCTSP);
  }
}
