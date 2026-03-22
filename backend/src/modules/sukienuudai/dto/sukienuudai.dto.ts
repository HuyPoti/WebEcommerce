import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsDate,
  IsDateString,
  isDateString,
  IsISO8601,
} from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/common/decorators/is-end-date-after-start-date.decorator';
import { IsFutureOrToday } from 'src/common/decorators/is-future-or-today.decorator';

enum TrangThai {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export class SuKienUuDaiDto {
  @IsString({ message: 'TÃªn sá»± kiá»‡n Æ°u Ä‘Ã£i pháº£i lÃ  chuá»—i' })
  @IsNotEmpty({ message: 'TÃªn sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TenSK: string;

  //mÃ´ táº£ sá»± kiá»‡n
  @IsString({ message: 'MÃ´ táº£ sá»± kiá»‡n Æ°u Ä‘Ã£i pháº£i lÃ  chuá»—i' })
  @IsNotEmpty({ message: 'MÃ´ táº£ sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MoTa: string;
  // NgÃ y báº¯t Ä‘áº§u sá»± kiá»‡n
  @IsDateString()
  @IsNotEmpty({ message: 'NgÃ y báº¯t Ä‘áº§u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  NgayPH: Date;
  // NgÃ y káº¿t thÃºc sá»± kiá»‡n
  @IsEndDateAfterStartDate('NgayPH', {
    message: 'NgÃ y káº¿t thÃºc pháº£i sau ngÃ y báº¯t Ä‘áº§u',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'NgÃ y káº¿t thÃºc khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  NgayKT: Date;

  //tráº¡ng thÃ¡i enum
  @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ   ACTIVE hoáº·c INACTIVE' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThai;
  //phan trÄƒm giáº£m giÃ¡
  @IsInt({ message: 'Pháº§n trÄƒm giáº£m giÃ¡ pháº£i lÃ  sá»‘ nguyÃªn' })
  @IsNotEmpty({ message: 'Pháº§n trÄƒm giáº£m giÃ¡ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  PhanTramGiam: number;

  //   @IsDate({ message: 'NgÃ y táº¡o pháº£i lÃ  ngÃ y há»£p lá»‡' })
  //   Created_at: Date;
  //   @IsDate({ message: 'NgÃ y cáº­p nháº­t pháº£i lÃ  ngÃ y há»£p lá»‡' })
  //   Updated_at: Date;
}

export class CreateSuKienUuDaiDto {
  @IsString({ message: 'TÃªn sá»± kiá»‡n Æ°u Ä‘Ã£i pháº£i lÃ  chuá»—i' })
  @IsNotEmpty({ message: 'TÃªn sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TenSK: string;

  //mÃ´ táº£ sá»± kiá»‡n
  @IsString({ message: 'MÃ´ táº£ sá»± kiá»‡n Æ°u Ä‘Ã£i pháº£i lÃ  chuá»—i' })
  @IsNotEmpty({ message: 'MÃ´ táº£ sá»± kiá»‡n Æ°u Ä‘Ã£i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MoTa: string;
  // NgÃ y báº¯t Ä‘áº§u sá»± kiá»‡n
  @IsFutureOrToday({
    message: 'NgÃ y báº¯t Ä‘áº§u pháº£i lÃ  hÃ´m nay hoáº·c trong tÆ°Æ¡ng lai',
  })
  
  @IsDateString()
  @IsNotEmpty({ message: 'NgÃ y báº¯t Ä‘áº§u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  NgayPH: Date;
  // NgÃ y káº¿t thÃºc sá»± kiá»‡n
  @IsEndDateAfterStartDate('NgayPH', {
    message: 'NgÃ y káº¿t thÃºc pháº£i sau ngÃ y báº¯t Ä‘áº§u',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'NgÃ y káº¿t thÃºc khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  NgayKT: Date;

  //tráº¡ng thÃ¡i enum
  @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ   ACTIVE hoáº·c INACTIVE' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThai;
  //phan trÄƒm giáº£m giÃ¡
  @IsInt({ message: 'Pháº§n trÄƒm giáº£m giÃ¡ pháº£i lÃ  sá»‘ nguyÃªn' })
  @IsNotEmpty({ message: 'Pháº§n trÄƒm giáº£m giÃ¡ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  PhanTramGiam: number;
}
