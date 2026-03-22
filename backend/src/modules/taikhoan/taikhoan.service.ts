import {
  BadRequestException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/modules/supabase/types';
import {
  TaiKhoanNghiepVuDto,
  UpdateTaiKhoanNghiepVuDto,
} from './dto/taikhoannghiepvu.dto';
import { GiohangRepository } from 'src/common/repositories/giohang.repository';
import { create } from 'domain';
// Define types based on the schema - matching Prisma exactly
type VaiTro = 'KH' | 'NCC' | 'QLDN' | 'NVVH' | 'NVCSKH' | 'ADMIN';
type TrangThai = 'ACTIVE' | 'INACTIVE';

export interface TAIKHOAN {
  MaTK: string;
  created_at: Date;
  updated_at: Date;
  Username: string | null; // Use null to match Prisma
  Status: TrangThai;
  Avatar: string | null; // Use null to match Prisma
  VAITRO: VaiTro;
  Email: string | null; // Use null to match Prisma
  DisplayName: string | null; // Use null to match Prisma
}
@Injectable()
export class TaikhoanService {
  private readonly supabase: SupabaseClient<Database>;
  constructor(
    private readonly prisma: PrismaService,
    private readonly gioHangRepository: GiohangRepository,
    private readonly auditService: AuditService,
  ) {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  // Dang ky tai khoan moi
  async dangKy(data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    // console.log(data);
    const existingUser = await this.prisma.tAIKHOAN.findFirst({
      where: { Username: data.Username },
    });
    // console.log(existingUser);
    if (existingUser) {
      throw new ConflictException('TÃ i khoáº£n Ä‘Ã£ tá»“n táº¡i');
    }
    let id = '';
    if (data.MaTK === undefined || data.MaTK === null) {
      const createUserSupabase = await this.supabase.auth.signUp({
        email: data.Email,
        password: data.MatKhau,
      });

      if (!createUserSupabase.data.user) {
        throw new ConflictException(
          createUserSupabase.error?.message ||
          'KhÃ´ng thá»ƒ táº¡o tÃ i khoáº£n Supabase',
        );
      }
      id = createUserSupabase.data.user.id;
    } else {
      id = data.MaTK;
    }
    const createUser = await this.prisma.tAIKHOAN.create({
      data: {
        Username: data.Username,
        DisplayName: data.DisplayName,
        Email: data.Email,
        VAITRO: 'KH',
        Status: 'ACTIVE',
        MaTK: id,
      },
    });
    console.log('Created user:', createUser);
    const createGioHang = await this.gioHangRepository.createCart({
      MaTKKH: createUser.MaTK,
    });

    return createUser;
  }

  // Dang ky tai khoan nha cung cap
  async dangKyNCC(data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    if (data.VAITRO !== 'NCC') {
      throw new BadRequestException('Vai trÃ² pháº£i lÃ  nhÃ  cung cáº¥p (NCC)');
    }
    const createUserSupabase = await this.supabase.auth.signUp({
      email: data.Email,
      password: data.MatKhau,
    });
    // console.log(createUserSupabase);
    if (createUserSupabase.error) {
      throw new Error(
        `Lá»—i khi táº¡o tÃ i khoáº£n Supabase: ${createUserSupabase.error.message}`,
      );
    }
    return this.prisma.tAIKHOAN.create({
      data: {
        Username: data.Username,
        DisplayName: data.DisplayName,
        Email: data.Email,
        Status: 'ACTIVE',
        VAITRO: 'NCC',
      },
    });
  }

  // Dang ky tai khoan quan ly
  async dangKyQL(data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    if (data.VAITRO !== 'QLDN') {
      throw new BadRequestException(
        'Vai trÃ² pháº£i lÃ  quáº£n lÃ½ doanh nghiá»‡p (QLDN)',
      );
    }
    const createUserSupabase = await this.supabase.auth.signUp({
      email: data.Email,
      password: data.MatKhau,
    });
    if (createUserSupabase.error) {
      throw new Error(
        `Lá»—i khi táº¡o tÃ i khoáº£n : ${createUserSupabase.error.message}`,
      );
    }
    return this.prisma.tAIKHOAN.create({
      data: {
        Username: data.Username,
        Status: 'ACTIVE',
        VAITRO: data.VAITRO,
      },
    });
  }

  // Dang ky tai khoan nhan vien
  async dangKyNV(data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    if (data.VAITRO !== 'NVVH' && data.VAITRO !== 'NVCSKH') {
      throw new BadRequestException(
        'Vai trÃ² pháº£i lÃ  nhÃ¢n viÃªn (NVVH hoáº·c NVCSKH)',
      );
    }

    if (data.MatKhau.length < 6) {
      throw new BadRequestException('Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±');
    }

    const createUserSupabase = await this.supabase.auth.signUp({
      email: data.Email,
      password: data.MatKhau,
    });

    if (!createUserSupabase.data.user) {
      throw new ConflictException(`${createUserSupabase.error?.message}`);
    }

    try {
      const res = await this.prisma.tAIKHOAN.create({
        data: {
          MaTK: createUserSupabase.data.user.id,
          Username: data.Username,
          DisplayName: data.DisplayName,
          Email: data.Email,
          Status: 'ACTIVE',
          VAITRO: data.VAITRO,
          updated_at: new Date(),
        },
      });
      return res;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng');
      }
      throw new InternalServerErrorException(
        'Lá»—i khi táº¡o tÃ i khoáº£n trong cÆ¡ sá»Ÿ dá»¯ liá»‡u',
      );
    }
  }

  // Lay tat ca tai khoan cua khach hang
  async taikhoans(): Promise<TAIKHOAN[]> {
    return this.prisma.tAIKHOAN.findMany({
      where: { VAITRO: { equals: 'KH' } },
    });
  }

  // Lay tat ca tai khoan cua quan ly
  async taikhoansQL(): Promise<TAIKHOAN[]> {
    return this.prisma.tAIKHOAN.findMany({
      where: { VAITRO: { in: ['QLDN'] } },
    });
  }

  // Lay tat ca tai khoan cua nhan vien
  async taikhoansNV(): Promise<TAIKHOAN[]> {
    return await this.prisma.tAIKHOAN.findMany({
      where: { VAITRO: { in: ['NVVH', 'NVCSKH'] } },
    });
  }

  // Lay tat ca tai khoan cua nha cung cap
  async taikhoansNCC(): Promise<TAIKHOAN[]> {
    return this.prisma.tAIKHOAN.findMany({
      where: { VAITRO: { equals: 'NCC' } },
    });
  }

  // Lay tai khoan theo ID
  async taikhoan(maTK: string): Promise<TAIKHOAN | null> {
    return this.prisma.tAIKHOAN.findUnique({
      where: { MaTK: maTK },
    });
  }

  // Cap nhat tai khoan
  async updateTaiKhoan(
    maTK: string,
    data: UpdateTaiKhoanNghiepVuDto,
  ): Promise<TAIKHOAN> {
    return this.prisma.tAIKHOAN.update({
      where: { MaTK: maTK },
      data: data,
    });
  }

  async updateTaiKhoanKhachHang(
    maTK: string,
    data: UpdateTaiKhoanNghiepVuDto,
  ): Promise<TAIKHOAN> {
    return this.prisma.tAIKHOAN.update({
      where: { MaTK: maTK },
      data: data,
    });
  }

  // Cap nhat tai khoan nghiep vu
  async updateTaiKhoanDoanhNghiep(
    maTK: string,
    data: UpdateTaiKhoanNghiepVuDto,
  ): Promise<TAIKHOAN> {
    if (data.MatKhau) {
      try {
        await this.supabase.auth.admin.updateUserById(maTK, {
          email: data.Email,
          password: data.MatKhau,
        });

        console.log('Updated Supabase user successfully');
        await this.auditService.log({
          maTK,
          hanhDong: 'UPDATE_SUPABASE_AUTH',
          module: 'TAIKHOAN',
          chiTiet: `Updated credentials for user ${maTK}`,
        });
      } catch (error) {
        console.error('Error updating Supabase user:', error);
        throw new Error('KhÃ´ng thá»ƒ cáº­p nháº­t thÃ´ng tin tÃ i khoáº£n Supabase');
      }
    }

    const { MatKhau, ...dataWithoutPassword } = data;
    return this.prisma.tAIKHOAN.update({
      where: { MaTK: maTK },
      data: dataWithoutPassword,
    });
  }

  // Cap nhat vai tro tai khoan
  async updateVaiTro(maTK: string, vaiTro: VaiTro): Promise<TAIKHOAN> {
    return this.prisma.tAIKHOAN.update({
      where: { MaTK: maTK },
      data: { VAITRO: vaiTro },
    });
  }

  // Cap nhat trang thai tai khoan
  async updateTrangThai(maTK: string, trangThai: TrangThai): Promise<TAIKHOAN> {
    const result = await this.prisma.tAIKHOAN.update({
      where: { MaTK: maTK },
      data: { Status: trangThai },
    });

    await this.auditService.log({
      maTK,
      hanhDong: 'UPDATE_STATUS',
      module: 'TAIKHOAN',
      chiTiet: `Account status changed to ${trangThai}`,
    });

    return result;
  }
}
