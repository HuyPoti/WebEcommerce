import { Injectable } from '@nestjs/common';
import {  TrangThaiPhieuNhapHang } from '@prisma/client';
import { PhieuNhapHangMapper } from 'src/modules/phieunhaphang/entity/phieunhaphang.mapper';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class PhieuNhapHangRepository {
  constructor(private readonly prisma: PrismaService) {}
  //láº¥y táº¥t cáº£ phiáº¿u nháº­p hÃ ng
  async findAll() {
    const phieuNhapHangs = await this.prisma.pHIEUNHAPHANG.findMany();
    return phieuNhapHangs
      ? PhieuNhapHangMapper.toEntityList(phieuNhapHangs)
      : [];
  }
  //láº¥y phiáº¿u nháº­p hÃ ng theo id
  async findById(id: string) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.findUnique({
      where: { MaPNH: id },
    });
    return phieuNhapHang ? PhieuNhapHangMapper.toEntity(phieuNhapHang) : null;
  }
  async findByIdNcc(id: string) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.findMany({
      where: { MaNCC: id },
    });
    return phieuNhapHang;
  }
  //táº¡o phiáº¿u nháº­p hÃ ng
  async create(newdata: any) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.create({
      data: newdata,
    });
    return phieuNhapHang ? PhieuNhapHangMapper.toEntity(phieuNhapHang) : null;
  }
  //cáº­p nháº­t phiáº¿u nháº­p hÃ ng
  async update(MaPNH: string, updatedata: any) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.update({
      where: { MaPNH },
      data: updatedata,
    });

    return phieuNhapHang ? PhieuNhapHangMapper.toEntity(phieuNhapHang) : null;
  }
  //NhÃ¢n viÃªn xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  async nhanVienXacNhan(
    MaPNH: string,
    MaTKNVXN: string,
    TrangThai: TrangThaiPhieuNhapHang,
  ) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.update({
      where: { MaPNH },
      data: {
        MaTKNVXN,
        TrangThai,
      },
    });
    return PhieuNhapHangMapper.toEntity(phieuNhapHang);
  }
  //NhÃ  cung cáº¥p xÃ¡c nháº­n phiáº¿u nháº­p hÃ ng
  async nhaCungCapXacNhan(MaPNH: string, TrangThai: TrangThaiPhieuNhapHang) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.update({
      where: { MaPNH },
      data: {
        TrangThai: TrangThai,
      },
    });
    return PhieuNhapHangMapper.toEntity(phieuNhapHang);
  }
  //NhÃ  cung cáº¥p tá»« chá»‘i phiáº¿u nháº­p hÃ ng
  async nhaCungCapTuChoi(MaPNH: string, TrangThai: TrangThaiPhieuNhapHang) {
    const phieuNhapHang = await this.prisma.pHIEUNHAPHANG.update({
      where: { MaPNH },
      data: {
        TrangThai: TrangThai,
      },
    });
    return PhieuNhapHangMapper.toEntity(phieuNhapHang);
  }

  //láº¥y phiáº¿u nháº­p hÃ ng phÃ¢n trang
  async findPaged(params: {
    page: number;
    pageSize: number;
    status?: TrangThaiPhieuNhapHang;
    date?: string;
  }) {
    const { page, pageSize, status, date } = params;
    const list = await this.prisma.pHIEUNHAPHANG.findMany({
      where: {
        ...(status && { TrangThai: status }),
        ...(date && { NgayNhap: date }),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    //láº¥y tá»•ng sá»‘ báº£n ghi
    const total = await this.prisma.pHIEUNHAPHANG.count({
      where: {
        ...(status && { TrangThai: status }),
        ...(date && { NgayNhap: date }),
      },
    });
    return { list, total };
  }
}
