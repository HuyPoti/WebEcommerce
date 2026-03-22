import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'MÃ£ chi tiáº¿t sáº£n pháº©m', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  MaCTSP?: string;

  @ApiProperty({ description: 'Sá»‘ lÆ°á»£ng sáº£n pháº©m', example: 1, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SoLuong?: number;
}

export class UpdateQuantityDto {
  @ApiProperty({ description: 'Sá»‘ lÆ°á»£ng má»›i', example: 2, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SoLuong: number;
}

export class CartItemResponseDto {
  @ApiProperty({ description: 'MÃ£ chi tiáº¿t giá» hÃ ng' })
  MaCTGH: string;

  @ApiProperty({ description: 'Sá»‘ lÆ°á»£ng' })
  SoLuong: number;

  @ApiProperty({ description: 'ThÃ´ng tin chi tiáº¿t sáº£n pháº©m' })
  CHITIETSANPHAM: {
    MaCTSP: string;
    KichCo: string;
    SoLuong: number;
    SANPHAM: {
      MaSP: string;
      TenSP: string;
      GiaBan: number;
      MoTa: string | null;
      MauSac: string;
      HinhAnh: Array<string>;
    };
  };
}

// export class CartResponseDto {
//   items?: CartItemResponseDto[];
// }
