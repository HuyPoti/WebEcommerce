import { BadRequestException, Injectable } from '@nestjs/common';
import { ThongbaoRepository } from 'src/common/repositories/thongbao.repository';
import { ThongBaoDto } from './dto/thongbao.dto';
import { LoaiTB } from 'src/common/constant';

@Injectable()
export class ThongbaoService {
    constructor(private readonly thongbaoRepository: ThongbaoRepository) { }

    async getAllSuKienUuDai() {
        return this.thongbaoRepository.findAllSK();
    }

    async getAllVoucher() {
        const data = await this.thongbaoRepository.findAllVC();
        return data;
    }

    async updateThongBaoSK(thongbao: ThongBaoDto[]) {
        for (const tb of thongbao) {
            if (tb.MaTB == "") {
                const create = await this.thongbaoRepository.createThongBao(tb.Loai, tb.MaSK, undefined);
                if (!create) {
                    throw new BadRequestException('Táº¡o thÃ´ng bÃ¡o tháº¥t báº¡i');
                }
            }
        }
        const existingTBs = await this.thongbaoRepository.findAllSK();
        const tbToDelete = existingTBs.filter(
            (existingTB) =>
                !thongbao.some(
                    (tb) => tb.MaTB === existingTB.MaTB
                )
        );
        for (const tb of tbToDelete) {
            const deleteTB = await this.thongbaoRepository.deleteById(tb.MaTB);
            if (!deleteTB) {
                throw new BadRequestException('XÃ³a thÃ´ng bÃ¡o tháº¥t báº¡i');
            }
        }
    }

    async updateThongBaoVC(thongbao: ThongBaoDto[]) {
        for (const tb of thongbao) {
            if (tb.MaTB == "") {
                const create = await this.thongbaoRepository.createThongBao(tb.Loai, undefined, tb.MaVoucher);
                if (!create) {
                    throw new BadRequestException('Táº¡o thÃ´ng bÃ¡o tháº¥t báº¡i');
                }
            }
        }
        const existingTBs = await this.thongbaoRepository.findAllVC();
        const tbToDelete = existingTBs.filter(
            (existingTB) =>
                !thongbao.some(
                    (tb) => tb.MaTB === existingTB.MaTB
                )
        );
        for (const tb of tbToDelete) {
            const deleteTB = await this.thongbaoRepository.deleteById(tb.MaTB);
            if (!deleteTB) {
                throw new BadRequestException('XÃ³a thÃ´ng bÃ¡o tháº¥t báº¡i');
            }
        }
    }
    async deleteThongBaoVC() {
        // Logic xÃ³a thÃ´ng bÃ¡o voucher
        // VÃ­ dá»¥: XÃ³a táº¥t cáº£ thÃ´ng bÃ¡o cÃ³ Loáº¡i lÃ  VOUCHER
        const existingTBs = await this.thongbaoRepository.findAllVC();
        if (existingTBs.length === 0) {
            return;
        }
        const result = await this.thongbaoRepository.deleteByLoai(LoaiTB.VOUCHER);
        if (!result) {
            throw new BadRequestException('XÃ³a thÃ´ng bÃ¡o tháº¥t báº¡i');
        }
    }
    async deleteThongBaoSK() {
        // Logic xÃ³a thÃ´ng bÃ¡o sá»± kiá»‡n
        // VÃ­ dá»¥: XÃ³a táº¥t cáº£ thÃ´ng bÃ¡o cÃ³ Loáº¡i lÃ  SUKIENUUDAI
        const existingTBs = await this.thongbaoRepository.findAllVC();
        if (existingTBs.length === 0) {
            return;
        }
        const result = await this.thongbaoRepository.deleteByLoai(LoaiTB.SUKIENUUDAI);
        if (!result) {
            throw new BadRequestException('XÃ³a thÃ´ng bÃ¡o tháº¥t báº¡i');
        }
    }
}
