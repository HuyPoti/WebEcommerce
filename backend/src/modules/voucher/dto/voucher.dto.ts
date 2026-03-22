import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/common/decorators/is-end-date-after-start-date.decorator';
import { IsFutureOrToday } from 'src/common/decorators/is-future-or-today.decorator';
import { TrangThai, LoaiVoucher } from 'src/common/constant';
export class VoucherDto {
    @IsString({ message: 'TÃªn voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'TÃªn voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    TenVoucher: string;
    //mÃ´ táº£ voucher
    @IsString({ message: 'MÃ´ táº£ voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'MÃ´ táº£ voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    MoTa: string;
    //Sá»‘ tiá»n giáº£m
    @IsInt({ message: 'Sá»‘ tiá»n giáº£m pháº£i lÃ  sá»‘ nguyÃªn' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    SoTien?: number;

    //Loáº¡i voucher
    @IsEnum(LoaiVoucher, { message: 'Loáº¡i voucher pháº£i lÃ  FreeShip hoáº·c GiamGia' })
    @IsNotEmpty({ message: 'Loáº¡i voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    Loai: LoaiVoucher;

    //Code voucher
    @IsString({ message: 'Code voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'Code voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    Code: string;

    @IsDateString({}, { message: 'NgÃ y báº¯t Ä‘áº§u khÃ´ng há»£p lá»‡' })
    @IsFutureOrToday({ message: 'NgÃ y báº¯t Ä‘áº§u pháº£i lÃ  ngÃ y hiá»‡n táº¡i hoáº·c tÆ°Æ¡ng lai' })
    NgayBatDau: string;

    @IsDateString({}, { message: 'NgÃ y káº¿t thÃºc khÃ´ng há»£p lá»‡' })
    @IsEndDateAfterStartDate('NgayBatDau', { message: 'NgÃ y káº¿t thÃºc pháº£i sau ngÃ y báº¯t Ä‘áº§u' })
    NgayKetThuc: string;

    //Ä‘iá»u kiá»‡n Ã¡p dá»¥ng
    @IsInt({ message: 'Äiá»u kiá»‡n Ã¡p dá»¥ng pháº£i lÃ  sá»‘ nguyÃªn' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    Dieukien?: number;

    @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ  active hoáº·c inactive' })
    TrangThai: TrangThai;

    //Sá»‘ lÆ°á»£ng voucher
    @IsInt({ message: 'Sá»‘ lÆ°á»£ng voucher pháº£i lÃ  sá»‘ nguyÃªn' })
    @IsNotEmpty({ message: 'Sá»‘ lÆ°á»£ng voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    SoLuong: number;
}
export class CreateVoucherDto {
    @IsString({ message: 'TÃªn voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'TÃªn voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    TenVoucher: string;
    //mÃ´ táº£ voucher
    @IsString({ message: 'MÃ´ táº£ voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'MÃ´ táº£ voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    MoTa: string;
    //Sá»‘ tiá»n giáº£m
    @IsNumber({}, { message: 'Sá»‘ tiá»n giáº£m pháº£i lÃ  sá»‘ nguyÃªn' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    SoTien?: number;

    //Loáº¡i voucher
    @IsEnum(LoaiVoucher, { message: 'Loáº¡i voucher pháº£i lÃ  FreeShip hoáº·c GiamGia' })
    @IsNotEmpty({ message: 'Loáº¡i voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    Loai: LoaiVoucher;

    //Code voucher
    @IsString({ message: 'Code voucher pháº£i lÃ  chuá»—i' })
    @IsNotEmpty({ message: 'Code voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    Code: string;

    @IsDateString({}, { message: 'NgÃ y báº¯t Ä‘áº§u khÃ´ng há»£p lá»‡' })
    NgayBatDau: string;

    @IsDateString({}, { message: 'NgÃ y káº¿t thÃºc khÃ´ng há»£p lá»‡' })
    @IsEndDateAfterStartDate('NgayBatDau', { message: 'NgÃ y káº¿t thÃºc pháº£i sau ngÃ y báº¯t Ä‘áº§u' })
    NgayKetThuc: string;

    //Ä‘iá»u kiá»‡n Ã¡p dá»¥ng
    @IsNumber({}, { message: 'Äiá»u kiá»‡n Ã¡p dá»¥ng pháº£i lÃ  sá»‘ nguyÃªn' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    Dieukien?: number;

    @IsEnum(TrangThai, { message: 'Tráº¡ng thÃ¡i pháº£i lÃ  active hoáº·c inactive' })
    TrangThai: TrangThai;

    //Sá»‘ lÆ°á»£ng voucher
    @IsNumber({}, { message: 'Sá»‘ lÆ°á»£ng voucher pháº£i lÃ  sá»‘ nguyÃªn' })
    @IsNotEmpty({ message: 'Sá»‘ lÆ°á»£ng voucher khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
    SoLuong: number;
}
