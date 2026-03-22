import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, CHITIETSANPHAM } from '@prisma/client';
import { ChiTietSanPhamDto } from './dto/chitietsanpham.dto';

@Injectable()
export class ChitietsanphamService {
  constructor(private prisma: PrismaService) {}

  async chitietsanphams(params: {
    take?: number;
    skip?: number;
    cursor?: Prisma.CHITIETSANPHAMWhereUniqueInput;
    where?: Prisma.CHITIETSANPHAMWhereInput;
    orderBy?: Prisma.CHITIETSANPHAMOrderByWithRelationInput;
  }): Promise<CHITIETSANPHAM[]> {
    const { take, skip, cursor, where, orderBy } = params;
    return this.prisma.cHITIETSANPHAM.findMany({
      include: { SANPHAM: true },
      take,
      skip,
      cursor,
      where,
      orderBy,
    });
  }

  async chitietsanpham(
    id: Prisma.CHITIETSANPHAMWhereUniqueInput,
  ): Promise<CHITIETSANPHAM | null> {
    return this.prisma.cHITIETSANPHAM.findUnique({
      where: id,
      include: { SANPHAM: true },
    });
  }

  async createChitietsanpham(data: ChiTietSanPhamDto): Promise<CHITIETSANPHAM> {
    try {
      return await this.prisma.cHITIETSANPHAM.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException('Táº¡o chi tiáº¿t sáº£n pháº©m tháº¥t báº¡i: ' + error);
    }
  }

  async deleteChitietsanpham(
    where: Prisma.CHITIETSANPHAMWhereUniqueInput,
  ): Promise<CHITIETSANPHAM> {
    try {
      return await this.prisma.cHITIETSANPHAM.delete({
        where,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Chi tiáº¿t sáº£n pháº©m khÃ´ng tá»“n táº¡i');
      }
      throw error;
    }
  }

  async updateChitietsanpham(params: {
    where: Prisma.CHITIETSANPHAMWhereUniqueInput;
    data: ChiTietSanPhamDto;
  }): Promise<CHITIETSANPHAM> {
    const { where, data } = params;
    try {
      return await this.prisma.cHITIETSANPHAM.update({ where, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Chi tiáº¿t sáº£n pháº©m khÃ´ng tá»“n táº¡i');
      }
      throw new BadRequestException('Cáº­p nháº­t tháº¥t báº¡i: ' + error);
    }
  }

  async tangSoLuongChitietsanpham(
    where: Prisma.CHITIETSANPHAMWhereUniqueInput,
    tangSoLuong: number,
  ): Promise<CHITIETSANPHAM> {
    const chitietsanpham = await this.prisma.cHITIETSANPHAM.findUnique({
      where,
    });
    if (!chitietsanpham) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y chi tiáº¿t sáº£n pháº©m');
    }

    return this.prisma.cHITIETSANPHAM.update({
      where,
      data: { SoLuong: chitietsanpham.SoLuong + tangSoLuong },
    });
  }

  async giamSoLuongChitietsanpham(
    where: Prisma.CHITIETSANPHAMWhereUniqueInput,
    giamSoLuong: number,
  ): Promise<CHITIETSANPHAM> {
    const chitietsanpham = await this.prisma.cHITIETSANPHAM.findUnique({
      where,
    });
    if (!chitietsanpham) {
      throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y chi tiáº¿t sáº£n pháº©m');
    }

    return this.prisma.cHITIETSANPHAM.update({
      where,
      data: { SoLuong: chitietsanpham.SoLuong - giamSoLuong },
    });
  }
}
