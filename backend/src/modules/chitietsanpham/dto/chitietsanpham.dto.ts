import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { KichCo, TrangThaiSP } from '@prisma/client';

export class ChiTietSanPhamDto {
  @IsEnum(KichCo, {
    message: `KÃ­ch cá»¡ khÃ´ng há»£p lá»‡. GiÃ¡ trá»‹ há»£p lá»‡: ${Object.values(KichCo).join(', ')}`,
  })
  KichCo: KichCo;
  @IsOptional()
  @IsUUID('4', { message: 'MÃ£ sáº£n pháº©m (MaSP) pháº£i lÃ  UUID há»£p lá»‡' })
  MaSP: string;

  @IsInt({ message: 'Sá»‘ lÆ°á»£ng pháº£i lÃ  sá»‘ nguyÃªn' })
  @Min(0, { message: 'Sá»‘ lÆ°á»£ng khÃ´ng Ä‘Æ°á»£c Ã¢m' })
  SoLuong: number;

  @IsOptional()
  @IsEnum(TrangThaiSP, {
    message: `Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡. GiÃ¡ trá»‹ há»£p lá»‡: ${Object.values(TrangThaiSP).join(', ')}`,
  })
  TrangThaiSP?: TrangThaiSP;
}
