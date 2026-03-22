import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

// Enum for order status
export enum TrangThaiDonHang {
  CHUA_GIAO = 'CHUA_GIAO',
  DANG_GIAO = 'DANG_GIAO',
  DA_GIAO = 'DA_GIAO',
  HUY = 'HUY',
  LOI = 'LOI',
  XAC_NHAN_LOI = 'XAC_NHAN_LOI',
}

// DTO for creating order status
export class CreateTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'MÃ£ Ä‘Æ¡n hÃ ng',
    example: 'uuid-dh-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'MÃ£ Ä‘Æ¡n hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  MaDH: string;

  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.CHUA_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThaiDonHang;
}

// DTO for updating order status
export class UpdateTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng má»›i',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡' })
  @IsNotEmpty({ message: 'Tráº¡ng thÃ¡i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng' })
  TrangThai: TrangThaiDonHang;
}

// Response DTO for order status
export class TinhtrangDonhangResponseDto {
  @ApiProperty({ description: 'MÃ£ tÃ¬nh tráº¡ng Ä‘Æ¡n hÃ ng', example: 'uuid-ttdh-123' })
  MaTTDH: string;

  @ApiProperty({ description: 'NgÃ y táº¡o', example: '2025-10-11T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  TrangThai: TrangThaiDonHang;

  @ApiProperty({ description: 'MÃ£ Ä‘Æ¡n hÃ ng', example: 'uuid-dh-123', nullable: true })
  MaDH: string | null;

  @ApiProperty({ 
    description: 'ThÃ´ng tin Ä‘Æ¡n hÃ ng',
    nullable: true,
    example: {
      MaDH: 'uuid-dh',
      TongTien: 500000,
      created_at: '2025-10-11T10:00:00Z'
    }
  })
  DONHANG?: {
    MaDH: string;
    TongTien: number | null;
    created_at: Date;
  } | null;
}

// Response DTO for order status history
export class TinhtrangDonhangHistoryDto {
  @ApiProperty({ description: 'MÃ£ Ä‘Æ¡n hÃ ng', example: 'uuid-dh-123' })
  MaDH: string;

  @ApiProperty({ 
    description: 'Lá»‹ch sá»­ tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng',
    type: [TinhtrangDonhangResponseDto]
  })
  history: TinhtrangDonhangResponseDto[];

  @ApiProperty({ description: 'Tá»•ng sá»‘ báº£n ghi', example: 5 })
  total: number;

  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i hiá»‡n táº¡i',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  currentStatus: TrangThaiDonHang;
}

// DTO for filtering order statuses
export class FilterTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'MÃ£ Ä‘Æ¡n hÃ ng (optional)',
    example: 'uuid-dh-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaDH?: string;

  @ApiProperty({ 
    description: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng (optional)',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO,
    required: false
  })
  @IsEnum(TrangThaiDonHang, { message: 'Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡' })
  @IsOptional()
  TrangThai?: TrangThaiDonHang;
}

// Response DTO for status statistics
export class TinhtrangDonhangStatsDto {
  @ApiProperty({ description: 'Tá»•ng sá»‘ Ä‘Æ¡n hÃ ng', example: 100 })
  total: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n chÆ°a giao', example: 20 })
  chuaGiao: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n Ä‘ang giao', example: 30 })
  dangGiao: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n Ä‘Ã£ giao', example: 40 })
  daGiao: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n Ä‘Ã£ há»§y', example: 5 })
  huy: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n lá»—i', example: 3 })
  loi: number;

  @ApiProperty({ description: 'Sá»‘ Ä‘Æ¡n xÃ¡c nháº­n lá»—i', example: 2 })
  xacNhanLoi: number;
}
