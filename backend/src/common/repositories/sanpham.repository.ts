import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class SanPhamRepository {
  constructor(private readonly prisma: PrismaService) {}
  //láº¥y sáº£n pháº©m theo mÃ£ sáº£n pháº©m
  async findSPByID(MaSP: string) {
    return await this.prisma.sANPHAM.findUnique({
      where: { MaSP },
    });
  }
  async findSPBySlug(slug: string) {
    return await this.prisma.sANPHAM.findFirst({
      where: { slug: { equals: slug['slug'] } },
    });
  }
}
