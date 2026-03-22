import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { UUID } from 'crypto';

// Enum for order status
export enum TrangThaiDonHang {
  CHUA_GIAO = 'CHUA_GIAO',
  DANG_GIAO = 'DANG_GIAO',
  DA_GIAO = 'DA_GIAO',
  HUY = 'HUY',
  LOI = 'LOI',
  XAC_NHAN_LOI = 'XAC_NHAN_LOI',
}

// DTO for creating order
export class CreateDonhangDto {
  //mÃ£ Ä‘Æ¡n hÃ ng kiá»ƒu uuid
  @ApiProperty({ 
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'MÃ£ Ä‘Æ¡n hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaDH: string;
  //mÃ£ chi tiáº¿t sáº£n pháº©m    
  @ApiProperty({ 
    description: 'MÃ£ chi tiáº¿t sáº£n pháº©m',
    example: 'uuid-ctsp-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'MÃ£ chi tiáº¿t sáº£n pháº©m khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaCTSP: string;

  @ApiProperty({ 
    description: 'Sá»‘ lÆ°á»£ng sáº£n pháº©m Ä‘áº·t hÃ ng',
    example: 2,
    minimum: 1
  })
  @IsInt({ message: 'Sá»‘ lÆ°á»£ng pháº£i lÃ  sá»‘ nguyÃªn' })
  @Min(1, { message: 'Sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n 0' })
  SoLuong: number;

  @ApiProperty({ 
    description: 'MÃ£ tÃ i khoáº£n khÃ¡ch hÃ ng',
    example: 'uuid-tk-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaTK_KH?: string;

  @ApiProperty({ 
    description: 'MÃ£ voucher Ã¡p dá»¥ng',
    example: 'uuid-voucher-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaVoucher?: string;

  @ApiProperty({ 
    description: 'MÃ£ sá»± kiá»‡n Æ°u Ä‘Ã£i',
    example: 'uuid-sk-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaSK?: string;

  //Ä‘á»‹a chá»‰
  @ApiProperty({
    description: 'Äá»‹a chá»‰ giao hÃ ng',
    example: '123 ÄÆ°á»ng ABC, Quáº­n 1, TP.HCM'
  })
  @IsString()
  @IsNotEmpty({ message: 'Äá»‹a chá»‰ giao hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  DiaChi: string;

  //sá»‘ Ä‘iá»‡n thoáº¡i
  @ApiProperty({
    description: 'Sá»‘ Ä‘iá»‡n thoáº¡i liÃªn há»‡',
    example: '0909123456'
  })
  @IsString()
  @IsNotEmpty({ message: 'Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  SoDienThoai: string;

  //tá»•ng tiá»n
  @ApiProperty({
    description: 'Tá»•ng tiá»n Ä‘Æ¡n hÃ ng',
    example: 500000
  })
  @IsInt({ message: 'Tá»•ng tiá»n pháº£i lÃ  sá»‘ nguyÃªn' })
  @Min(0, { message: 'Tá»•ng tiá»n khÃ´ng Ä‘Æ°á»£c Ã¢m' })
  TongTien: number;
  //hoten nguoi nhan
  @ApiProperty({
    description: 'Há» tÃªn ngÆ°á»i nháº­n hÃ ng',
    example: 'Nguyá»…n VÄƒn A'
  })
  @IsString()
  @IsNotEmpty({ message: 'Há» tÃªn ngÆ°á»i nháº­n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TenNM: string;
}

//create tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng
export class CreateDonhangStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'MÃ£ Ä‘Æ¡n hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaDH: string;
  @IsEnum(TrangThaiDonHang, { message: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThaiDonHang;
}

// DTO for updating order status
export class UpdateDonhangStatusDto {
  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThaiDonHang;
}

// Response DTO for order details
export class DonhangResponseDto {
  @ApiProperty({ description: 'MÃ£ Ä‘Æ¡n hÃ ng', example: 'uuid-dh-123' })
  MaDH: string;

  @ApiProperty({ description: 'NgÃ y táº¡o Ä‘Æ¡n hÃ ng', example: '2025-10-11T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Sá»‘ lÆ°á»£ng sáº£n pháº©m', example: 2 })
  SoLuong: number;

  @ApiProperty({ description: 'Tá»•ng tiá»n', example: 500000, nullable: true })
  TongTien: number | null;

  @ApiProperty({ 
    description: 'Chi tiáº¿t sáº£n pháº©m',
    example: {
      MaCTSP: 'uuid-ctsp',
      KichCo: 'L',
      SANPHAM: {
        MaSP: 'uuid-sp',
        TenSP: 'Ão khoÃ¡c bomber',
        GiaBan: 250000,
        MoTa: 'Ão khoÃ¡c bomber cháº¥t liá»‡u cao cáº¥p',
        MauSac: 'Black',
        HinhAnh: ['url1', 'url2']
      }
    }
  })
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
      HinhAnh: string[];
    };
  };

  @ApiProperty({ 
    description: 'ThÃ´ng tin voucher',
    nullable: true,
    example: {
      MaVoucher: 'uuid-voucher',
      TenVoucher: 'Giáº£m 10%',
      SoTien: 50000
    }
  })
  VOUCHER: {
    MaVoucher: string;
    TenVoucher: string;
    SoTien: number;
    FreeShip: boolean;
  } | null;

  @ApiProperty({ 
    description: 'ThÃ´ng tin sá»± kiá»‡n Æ°u Ä‘Ã£i',
    nullable: true,
    example: {
      MaSK: 'uuid-sk',
      TenSK: 'Black Friday',
      PhanTramGiam: 20
    }
  })
  SUKIENUUDAI: {
    MaSK: string;
    TenSK: string;
    PhanTramGiam: number;
  } | null;

  @ApiProperty({ 
    description: 'ThÃ´ng tin khÃ¡ch hÃ ng',
    nullable: true,
    example: {
      MaTK: 'uuid-tk',
      Username: 'nguyenvana',
      Avatar: 'url-avatar'
    }
  })
  KHACHHANG_ACCOUNT: {
    MaTK: string;
    Username: string | null;
    Avatar: string | null;
  } | null;

  @ApiProperty({ 
    description: 'Danh sÃ¡ch tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng',
    example: [
      {
        MaTTDH: 'uuid-ttdh-1',
        TrangThai: 'CHUA_GIAO',
        created_at: '2025-10-11T10:30:00Z'
      },
      {
        MaTTDH: 'uuid-ttdh-2',
        TrangThai: 'DANG_GIAO',
        created_at: '2025-10-11T14:00:00Z'
      }
    ]
  })
  TINHTRANGDONHANG: {
    MaTTDH: string;
    TrangThai: string;
    created_at: Date;
  }[];
}

// Response DTO for order list
export class DonhangListResponseDto {
  @ApiProperty({ description: 'Danh sÃ¡ch Ä‘Æ¡n hÃ ng' })
  orders: DonhangResponseDto[];

  @ApiProperty({ description: 'Tá»•ng sá»‘ Ä‘Æ¡n hÃ ng', example: 25 })
  total: number;
}
