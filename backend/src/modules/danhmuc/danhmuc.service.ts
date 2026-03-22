import { BadRequestException, Injectable } from '@nestjs/common';
import { TrangThai, LoaiDanhMuc } from 'src/common/constant';
import { DanhMucDto } from './dto/danhmuc.dto';
import { DanhMucRepository } from 'src/common/repositories/danhmuc.repository';
import { ExcelService } from './excel.service';
@Injectable()
export class DanhMucService {
    constructor(
        private readonly danhMucRepository: DanhMucRepository,
        private readonly excelService: ExcelService,
    ) {}

    async getAllDanhMuc() {
        return this.danhMucRepository.findAll();
    }
    async getDanhMucById(id: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh má»¥c khÃ´ng tá»“n táº¡i');
        }
        return existingDanhMuc;
    }
    async addDanhMuc(data: DanhMucDto) {
        const existingDanhMuc = await this.danhMucRepository.findByName(data.TenDM);
        if (existingDanhMuc) {
            throw new BadRequestException('Danh má»¥c Ä‘Ã£ tá»“n táº¡i');
        }
        return this.danhMucRepository.createDanhMuc(data);
    }
    async updateDanhMuc(id: string, data: DanhMucDto) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh má»¥c khÃ´ng tá»“n táº¡i');
        }
        if (data.TenDM && data.TenDM !== existingDanhMuc.TenDM) {
            const danhMucWithSameName = await this.danhMucRepository.findByName(data.TenDM);
            if (danhMucWithSameName) {
                throw new BadRequestException('TÃªn danh má»¥c Ä‘Ã£ tá»“n táº¡i');
            }
        }   
        return this.danhMucRepository.updateDanhMuc(id, data);
    }
    async changeTrangThai(id: string, trangThai: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh má»¥c khÃ´ng tá»“n táº¡i');
        }
        if (!(trangThai in TrangThai)) {
            throw new BadRequestException('Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡');
        }
        return this.danhMucRepository.changeTrangThai(id, trangThai as TrangThai);
    }
    async changeLoai(id: string, Loai: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh má»¥c khÃ´ng tá»“n táº¡i');
        }
        if (!(Loai in LoaiDanhMuc)) {
            throw new BadRequestException('Loáº¡i danh má»¥c khÃ´ng há»£p lá»‡');
        }
        const updatedDanhMuc = await this.danhMucRepository.changeLoai(id, Loai as LoaiDanhMuc);
        if (!updatedDanhMuc) {
            throw new BadRequestException('Cáº­p nháº­t loáº¡i danh má»¥c tháº¥t báº¡i');
        }
        return updatedDanhMuc;
    }
    async exportDanhMucToExcel() : Promise<Buffer> {
        //láº¥y tÃªn nhÃ¢n viÃªn Ä‘Äƒng nháº­p tá»« token
        const currentUser = { id: 1, name: 'Admin' }; // giáº£ láº­p thÃ´ng tin ngÆ°á»i dÃ¹ng
        const danhMucList = await this.danhMucRepository.findAll();
        return this.excelService.generateToExcel(danhMucList, currentUser.name);
    }
}
