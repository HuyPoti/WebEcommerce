import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class PhanHoiDto {
    //mÃ£ tÃ i khoáº£n
    @IsString({ message: 'MÃ£ tÃ i khoáº£n pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
    @IsNotEmpty({ message: 'MÃ£ tÃ i khoáº£n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    MaTKKH: string;

    //mÃ£ sáº£n pháº©m
    @IsString({ message: 'MÃ£ sáº£n pháº©m pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
    @IsNotEmpty({ message: 'MÃ£ sáº£n pháº©m khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    MaSP: string;

    //Ä‘Ã¡nh giÃ¡ sao
    @IsNotEmpty({ message: 'ÄÃ¡nh giÃ¡ sao khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    SoSao: number;

    //BÃ¬nh luáº­n
    @IsString({ message: 'BÃ¬nh luáº­n pháº£i lÃ  chuá»—i kÃ½ tá»±.' })
    @IsNotEmpty({ message: 'BÃ¬nh luáº­n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    BinhLuan: string;

    //ngÃ y táº¡o
    @IsNotEmpty({ message: 'NgÃ y táº¡o khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    @IsDate({ message: 'NgÃ y táº¡o pháº£i lÃ  kiá»ƒu ngÃ y thÃ¡ng.' })
    created_at?: Date;

    //ngÃ y cáº­p nháº­t
    @IsNotEmpty({ message: 'NgÃ y cáº­p nháº­t khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.' })
    @IsDate({ message: 'NgÃ y cáº­p nháº­t pháº£i lÃ  kiá»ƒu ngÃ y thÃ¡ng.' })
    updated_at?: Date;
}
