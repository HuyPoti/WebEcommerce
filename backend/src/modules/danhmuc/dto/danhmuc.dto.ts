import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TrangThai, LoaiDanhMuc } from 'src/common/constant';

export class DanhMucDto {
  @IsString({ message: 'TÃªn danh má»¥c pháº£i lÃ  chuá»—i' })
  @IsNotEmpty({ message: 'TÃªn danh má»¥c khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TenDM: string;

  @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ  active hoáº·c inactive' })
  TrangThai: TrangThai;

  @IsEnum(LoaiDanhMuc, { message: 'Loáº¡i danh má»¥c khÃ´ng há»£p lá»‡' })
  Loai: LoaiDanhMuc;
}
