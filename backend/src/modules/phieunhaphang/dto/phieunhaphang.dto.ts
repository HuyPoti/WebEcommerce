import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';
import { TrangThaiPhieuNhapHang } from "src/common/constant";

export class PhieuNhapHangDto{
    @IsNotEmpty({message: 'MÃ£ nhÃ  cung cáº¥p khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'})
    @IsString({message: 'MÃ£ nhÃ  cung cáº¥p pháº£i lÃ  chuá»—i'})
    MaNCC: string;

    /*
    @IsNotEmpty({message: 'MÃ£ nhÃ¢n viÃªn khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'})
    @IsString({message: 'MÃ£ nhÃ¢n viÃªn pháº£i lÃ  chuá»—i'})
    MaNV: string;*/

    @IsNotEmpty({message: 'MÃ£ tÃ i khoáº£n nhÃ¢n viÃªn quáº£n lÃ½ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'})
    @IsString({message: 'MÃ£ tÃ i khoáº£n nhÃ¢n viÃªn quáº£n lÃ½ pháº£i lÃ  chuá»—i'})
    MaTKNVQL: string;

    /*
    @IsString({message: 'MÃ£ tÃ i khoáº£n nhÃ¢n viÃªn xÃ¡c nháº­n pháº£i lÃ  chuá»—i'})
    MaTKNVXN?: string;*/

    /*
    @IsString({message: 'Ná»™i dung pháº£i lÃ  chuá»—i'})
    NoiDung?: string;*/

    @Type(() => Date)
    @IsDate({message: 'NgÃ y nháº­p khÃ´ng há»£p lá»‡'})
    @IsNotEmpty({message: 'NgÃ y nháº­p khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'})
    created_at: Date;

    @IsEnum(TrangThaiPhieuNhapHang, {message: 'Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡'})
    @IsNotEmpty({message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'})
    TrangThai: TrangThaiPhieuNhapHang;
}
