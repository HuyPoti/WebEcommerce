import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { TrangThai } from 'src/common/constant';
export class VoucherKhachHangDto {
  @IsNotEmpty({ message: 'MÃ£ khÃ¡ch hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaTKKH: string;

  @IsNotEmpty({ message: 'MÃ£ voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaVoucher: string;

  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ  active hoáº·c inactive' })
  TrangThai: string;

  @IsNotEmpty({ message: 'NgÃ y táº¡o khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  @IsDate({ message: 'NgÃ y táº¡o khÃ´ng há»£p lá»‡' })
  created_at: Date;

  @IsNotEmpty({ message: 'NgÃ y cáº­p nháº­t khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  @IsDate({ message: 'NgÃ y cáº­p nháº­t khÃ´ng há»£p lá»‡' })
  updated_at: Date;

  @IsDate({ message: 'Háº¡n sá»­ dá»¥ng khÃ´ng há»£p lá»‡' })
  Hsd: Date;
}
