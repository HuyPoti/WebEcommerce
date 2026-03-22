import { BadRequestException, Injectable } from '@nestjs/common';
import { SuKienUuDaiDto } from './dto/sukienuudai.dto';
import { SuKienUuDaiRepository } from 'src/common/repositories/sukienuudai.repository';
import { TrangThai } from 'src/common/constant';
@Injectable()
export class SuKienUuDaiService {
  constructor(private readonly suKienUuDaiRepository: SuKienUuDaiRepository) {}

  async getAll() {
    const sukienuudais = await this.suKienUuDaiRepository.findAll();
    if (!sukienuudais) {
      return sukienuudais;
    }
    for (const sukienuudai of sukienuudais) {
      if (sukienuudai.NgayKT < new Date()) {
        await this.suKienUuDaiRepository.changeTrangThai(
          sukienuudai.MaSK,
          TrangThai.INACTIVE,
        );
      }
    }
    return sukienuudais;
  }

  async getById(id: string) {
    const existingSuKienUuDai =
      await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng tá»“n táº¡i');
    }
    return existingSuKienUuDai;
  }

  async addSuKienUuDai(suKienUuDaiDto: SuKienUuDaiDto) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findByName(
      suKienUuDaiDto.TenSK,
    );
    if (existingSuKienUuDai) {
      throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i Ä‘Ã£ tá»“n táº¡i');
    }
    return await this.suKienUuDaiRepository.add(suKienUuDaiDto);
  }

  async updateSuKienUuDai(id: string, data: SuKienUuDaiDto) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng tá»“n táº¡i');
    }
    if (data.TenSK && data.TenSK !== existingSuKienUuDai.TenSK) {
      const suKienUuDaiWithSameName =
        await this.suKienUuDaiRepository.findByName(data.TenSK);
      if (suKienUuDaiWithSameName) {
        throw new BadRequestException('TÃªn sá»± kiá»‡n Æ°u Ä‘Ã£i Ä‘Ã£ tá»“n táº¡i');
      }
    }
    return await this.suKienUuDaiRepository.update(id, data);
  }

  async changeStatus(id: string, trangThai: string) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng tá»“n táº¡i');
    }
    if (!(trangThai in TrangThai)) {
      throw new BadRequestException('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
    }
    return await this.suKienUuDaiRepository.changeTrangThai(
      id,
      trangThai as TrangThai,
    );
  }

  //kiá»ƒm tra sá»± kiá»‡n Æ°u Ä‘Ã£i cÃ³ trong khoáº£ng thá»i gian Æ°u Ä‘Ã£i hay khÃ´ng
  async isEventActive(eventId: string): Promise<boolean> {
    const event = await this.suKienUuDaiRepository.findById(eventId);
    if (!event) {
      throw new BadRequestException('Sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng tá»“n táº¡i');
    }
    const currentDate = new Date();
    //náº¿u náº±m trong khoáº£ng thá»i gian nhÆ°ng trang thÃ¡i lÃ  INACTIVE thÃ¬ cÅ©ng khÃ´ng Ä‘Æ°á»£c Ã¡p dá»¥ng
    if (event.TrangThai === TrangThai.INACTIVE) {
      return false;
    }
    return event.NgayPH <= currentDate && event.NgayKT >= currentDate;
  }
}
