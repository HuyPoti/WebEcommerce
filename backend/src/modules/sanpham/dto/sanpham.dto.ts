import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { TrangThai } from '@prisma/client';

export class SanPhamDto {
  @IsString({ message: 'TÃªn sáº£n pháº©m pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
  @IsNotEmpty({ message: 'TÃªn sáº£n pháº©m khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
  TenSP: string;

  @IsOptional()
  @IsString({ message: 'MÃ´ táº£ sáº£n pháº©m pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
  MoTa?: string;

  @IsArray({ message: 'HÃ¬nh áº£nh pháº£i lÃ  má»™t máº£ng chuá»—i.' })
  @ArrayNotEmpty({ message: 'Pháº£i cÃ³ Ã­t nháº¥t má»™t hÃ¬nh áº£nh.' })
  @IsString({ each: true, message: 'Má»—i hÃ¬nh áº£nh pháº£i lÃ  chuá»—i.' })
  HinhAnh: string[];

  @IsInt({ message: 'GiÃ¡ bÃ¡n pháº£i lÃ  sá»‘ nguyÃªn.' })
  @Min(0, { message: 'GiÃ¡ bÃ¡n khÃ´ng Ä‘Æ°á»£c Ã¢m.' })
  GiaBan: number;

  @IsOptional()
  @IsInt({ message: 'GiÃ¡ mua pháº£i lÃ  sá»‘ nguyÃªn.' })
  @Min(0, { message: 'GiÃ¡ mua khÃ´ng Ä‘Æ°á»£c Ã¢m.' })
  GiaMua: number;

  @IsOptional()
  @IsEnum(TrangThai, {
    message:
      'Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡. GiÃ¡ trá»‹ há»£p lá»‡: ' +
      Object.values(TrangThai).join(', '),
  })
  TrangThai?: TrangThai;

  @IsString({ message: 'MÃ£ danh má»¥c pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
  @IsNotEmpty({ message: 'MÃ£ danh má»¥c khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
  MaDM: string;

  @IsString()
  MauSac: string;
  @IsString({ message: 'Slug pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
  @IsNotEmpty({ message: 'Slug khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
  slug: string;
}
