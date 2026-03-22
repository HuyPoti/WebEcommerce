import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DanhMucMapper } from 'src/modules/danhmuc/entity/danhmuc.mapper';
import { TrangThai } from 'src/common/constant';
import { LoaiDanhMuc } from '@prisma/client';

@Injectable()
export class DanhMucRepository {
  constructor(private readonly prisma: PrismaService) {}
  //tÃ¬m táº¥t cáº£ danh má»¥c
  async findAll() {
    const danhmucs = await this.prisma.dANHMUC.findMany();
    return danhmucs ? DanhMucMapper.toEntityList(danhmucs) : [];
  }
  //tÃ¬m danh má»¥c theo id
  async findById(id: string) {
    const danhmuc = await this.prisma.dANHMUC.findUnique({
      where: { MaDM: id },
    });
    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //tim danh má»¥c theo tÃªn
  async findByName(name: string) {
    return await this.prisma.dANHMUC.findFirst({
      where: { TenDM: name },
    });
  }
  //táº¡o má»›i danh má»¥c
  async createDanhMuc(newdata: any) {
    const danhmuc = await this.prisma.dANHMUC.create({
      data: newdata,
    });
    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //chá»‰nh sá»­a danh má»¥c dá»±a trÃªn id lÃ  chuá»—i
  async updateDanhMuc(MaDM: string, updatedata: any) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: updatedata,
    });

    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //thay Ä‘á»•i tráº¡ng thÃ¡i biáº¿t tráº¡ng thÃ¡i lÃ  kiá»ƒu enum
  async changeTrangThai(MaDM: string, TrangThai: TrangThai) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: {
        TrangThai,
        updated_at: new Date(),
      },
    });
    return DanhMucMapper.toEntity(danhmuc);
  }
  //thay Ä‘á»•i loáº¡i danh má»¥c biáº¿t loáº¡i lÃ  kiá»ƒu enum
  async changeLoai(MaDM: string, Loai: LoaiDanhMuc) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: {
        Loai,
        updated_at: new Date(),
      },
    });
    return DanhMucMapper.toEntity(danhmuc);
  }
}
