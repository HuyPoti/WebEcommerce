export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      CHITIETGIOHANG: {
        Row: {
          created_at: string;
          MaCTGH: string;
          MaCTSP: string;
          MaGH: string;
          SoLuong: number;
        };
        Insert: {
          created_at?: string;
          MaCTGH: string;
          MaCTSP: string;
          MaGH: string;
          SoLuong?: number;
        };
        Update: {
          created_at?: string;
          MaCTGH?: string;
          MaCTSP?: string;
          MaGH?: string;
          SoLuong?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'CHITIETGIOHANG_MaCTSP_fkey';
            columns: ['MaCTSP'];
            isOneToOne: false;
            referencedRelation: 'CHITIETSANPHAM';
            referencedColumns: ['MaCTSP'];
          },
          {
            foreignKeyName: 'CHITIETGIOHANG_MaGH_fkey';
            columns: ['MaGH'];
            isOneToOne: false;
            referencedRelation: 'GIOHANG';
            referencedColumns: ['MaGH'];
          },
        ];
      };
      CHITIETSANPHAM: {
        Row: {
          created_at: string;
          KichCo: Database['public']['Enums']['KichCo'];
          MaCTSP: string;
          MaSP: string;
          SoLuong: number;
          TrangThaiSP: Database['public']['Enums']['TrangThaiSP'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          KichCo: Database['public']['Enums']['KichCo'];
          MaCTSP: string;
          MaSP: string;
          SoLuong?: number;
          TrangThaiSP?: Database['public']['Enums']['TrangThaiSP'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          KichCo?: Database['public']['Enums']['KichCo'];
          MaCTSP?: string;
          MaSP?: string;
          SoLuong?: number;
          TrangThaiSP?: Database['public']['Enums']['TrangThaiSP'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'CHITIETSANPHAM_MaSP_fkey';
            columns: ['MaSP'];
            isOneToOne: false;
            referencedRelation: 'SANPHAM';
            referencedColumns: ['MaSP'];
          },
        ];
      };
      DANHMUC: {
        Row: {
          created_at: string;
          LoaiDanhMuc: Database['public']['Enums']['LoaiDanhMuc'];
          MaDM: string;
          TenDM: string;
          TrangThai: Database['public']['Enums']['TrangThai'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          LoaiDanhMuc: Database['public']['Enums']['LoaiDanhMuc'];
          MaDM: string;
          TenDM: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          LoaiDanhMuc?: Database['public']['Enums']['LoaiDanhMuc'];
          MaDM?: string;
          TenDM?: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Relationships: [];
      };
      DONHANG: {
        Row: {
          created_at: string;
          MaCTSP: string;
          MaDH: string;
          MaSK: string | null;
          MaTK_KH: string | null;
          MaVoucher: string | null;
          SoLuong: number;
          TongTien: number | null;
        };
        Insert: {
          created_at?: string;
          MaCTSP: string;
          MaDH: string;
          MaSK?: string | null;
          MaTK_KH?: string | null;
          MaVoucher?: string | null;
          SoLuong?: number;
          TongTien?: number | null;
        };
        Update: {
          created_at?: string;
          MaCTSP?: string;
          MaDH?: string;
          MaSK?: string | null;
          MaTK_KH?: string | null;
          MaVoucher?: string | null;
          SoLuong?: number;
          TongTien?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'DONHANG_MaCTSP_fkey';
            columns: ['MaCTSP'];
            isOneToOne: false;
            referencedRelation: 'CHITIETSANPHAM';
            referencedColumns: ['MaCTSP'];
          },
          {
            foreignKeyName: 'DONHANG_MaSK_fkey';
            columns: ['MaSK'];
            isOneToOne: false;
            referencedRelation: 'SUKIENUUDAI';
            referencedColumns: ['MaSK'];
          },
          {
            foreignKeyName: 'DONHANG_MaTK_KH_fkey';
            columns: ['MaTK_KH'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
          {
            foreignKeyName: 'DONHANG_MaVoucher_fkey';
            columns: ['MaVoucher'];
            isOneToOne: false;
            referencedRelation: 'VOUCHER';
            referencedColumns: ['MaVoucher'];
          },
        ];
      };
      GIOHANG: {
        Row: {
          created_at: string;
          MaGH: string;
          MaTKKH: string | null;
        };
        Insert: {
          created_at?: string;
          MaGH: string;
          MaTKKH?: string | null;
        };
        Update: {
          created_at?: string;
          MaGH?: string;
          MaTKKH?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'GIOHANG_MaTKKH_fkey';
            columns: ['MaTKKH'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
        ];
      };
      NHACUNGCAP: {
        Row: {
          created_at: string;
          DiaChi: string | null;
          DienThoai: string | null;
          Email: string | null;
          MaNCC: string;
          TenNCC: string;
        };
        Insert: {
          created_at?: string;
          DiaChi?: string | null;
          DienThoai?: string | null;
          Email?: string | null;
          MaNCC: string;
          TenNCC: string;
        };
        Update: {
          created_at?: string;
          DiaChi?: string | null;
          DienThoai?: string | null;
          Email?: string | null;
          MaNCC?: string;
          TenNCC?: string;
        };
        Relationships: [];
      };
      PHANHOI: {
        Row: {
          BinhLuan: string | null;
          created_at: string;
          MaPH: string;
          MaSP: string;
          MaTKKH: string;
          NoiDung: string;
          SoSao: number;
          updated_at: string;
        };
        Insert: {
          BinhLuan?: string | null;
          created_at?: string;
          MaPH: string;
          MaSP: string;
          MaTKKH: string;
          NoiDung: string;
          SoSao: number;
          updated_at?: string;
        };
        Update: {
          BinhLuan?: string | null;
          created_at?: string;
          MaPH?: string;
          MaSP?: string;
          MaTKKH?: string;
          NoiDung?: string;
          SoSao?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'PHANHOI_MaSP_fkey';
            columns: ['MaSP'];
            isOneToOne: false;
            referencedRelation: 'SANPHAM';
            referencedColumns: ['MaSP'];
          },
          {
            foreignKeyName: 'PHANHOI_MaTKKH_fkey';
            columns: ['MaTKKH'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
        ];
      };
      PHIEUNHAPHANG: {
        Row: {
          created_at: string;
          MaCTSP: string;
          MaNCC: string;
          MaPNNH: string;
          MaTKNVQL: string | null;
          MaTKNVXN: string | null;
          NoiDung: string;
          SoLuong: number;
          TrangThai: Database['public']['Enums']['TrangThaiPhieuNhapHang'];
        };
        Insert: {
          created_at?: string;
          MaCTSP: string;
          MaNCC: string;
          MaPNNH: string;
          MaTKNVQL?: string | null;
          MaTKNVXN?: string | null;
          NoiDung: string;
          SoLuong: number;
          TrangThai: Database['public']['Enums']['TrangThaiPhieuNhapHang'];
        };
        Update: {
          created_at?: string;
          MaCTSP?: string;
          MaNCC?: string;
          MaPNNH?: string;
          MaTKNVQL?: string | null;
          MaTKNVXN?: string | null;
          NoiDung?: string;
          SoLuong?: number;
          TrangThai?: Database['public']['Enums']['TrangThaiPhieuNhapHang'];
        };
        Relationships: [
          {
            foreignKeyName: 'PHIEUNHAPHANG_MaCTSP_fkey';
            columns: ['MaCTSP'];
            isOneToOne: false;
            referencedRelation: 'CHITIETSANPHAM';
            referencedColumns: ['MaCTSP'];
          },
          {
            foreignKeyName: 'PHIEUNHAPHANG_MaNCC_fkey';
            columns: ['MaNCC'];
            isOneToOne: false;
            referencedRelation: 'NHACUNGCAP';
            referencedColumns: ['MaNCC'];
          },
          {
            foreignKeyName: 'PHIEUNHAPHANG_MaTKNVQL_fkey';
            columns: ['MaTKNVQL'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
          {
            foreignKeyName: 'PHIEUNHAPHANG_MaTKNVXN_fkey';
            columns: ['MaTKNVXN'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
        ];
      };
      SANPHAM: {
        Row: {
          created_at: string;
          GiaBan: number;
          GiaMua: number;
          HinhAnh: string[] | null;
          MaDM: string;
          MaSP: string;
          MauSac: string;
          MoTa: string | null;
          TenSP: string;
          TrangThai: Database['public']['Enums']['TrangThai'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          GiaBan: number;
          GiaMua: number;
          HinhAnh?: string[] | null;
          MaDM: string;
          MaSP: string;
          MauSac: string;
          MoTa?: string | null;
          TenSP: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          GiaBan?: number;
          GiaMua?: number;
          HinhAnh?: string[] | null;
          MaDM?: string;
          MaSP?: string;
          MauSac?: string;
          MoTa?: string | null;
          TenSP?: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'SANPHAM_MaDM_fkey';
            columns: ['MaDM'];
            isOneToOne: false;
            referencedRelation: 'DANHMUC';
            referencedColumns: ['MaDM'];
          },
        ];
      };
      SUKIENUUDAI: {
        Row: {
          created_at: string;
          MaSK: string;
          MoTa: string | null;
          NgayKT: string;
          NgayPH: string;
          PhanTramGiam: number;
          TenSK: string;
          TrangThai: Database['public']['Enums']['TrangThai'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          MaSK: string;
          MoTa?: string | null;
          NgayKT: string;
          NgayPH: string;
          PhanTramGiam: number;
          TenSK: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          MaSK?: string;
          MoTa?: string | null;
          NgayKT?: string;
          NgayPH?: string;
          PhanTramGiam?: number;
          TenSK?: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Relationships: [];
      };
      TAIKHOAN: {
        Row: {
          Avatar: string | null;
          created_at: string;
          MaTK: string;
          MatKhau: string | null;
          Status: Database['public']['Enums']['TrangThai'];
          updated_at: string;
          Username: string | null;
          VAITRO: Database['public']['Enums']['VaiTro'];
        };
        Insert: {
          Avatar?: string | null;
          created_at?: string;
          MaTK: string;
          MatKhau?: string | null;
          Status?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
          Username?: string | null;
          VAITRO: Database['public']['Enums']['VaiTro'];
        };
        Update: {
          Avatar?: string | null;
          created_at?: string;
          MaTK?: string;
          MatKhau?: string | null;
          Status?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
          Username?: string | null;
          VAITRO?: Database['public']['Enums']['VaiTro'];
        };
        Relationships: [];
      };
      TINHTRANGDONHANG: {
        Row: {
          created_at: string;
          MaDH: string | null;
          MaTTDH: string;
          TrangThai: Database['public']['Enums']['TrangThaiDonHang'];
        };
        Insert: {
          created_at?: string;
          MaDH?: string | null;
          MaTTDH: string;
          TrangThai?: Database['public']['Enums']['TrangThaiDonHang'];
        };
        Update: {
          created_at?: string;
          MaDH?: string | null;
          MaTTDH?: string;
          TrangThai?: Database['public']['Enums']['TrangThaiDonHang'];
        };
        Relationships: [
          {
            foreignKeyName: 'TINHTRANGDONHANG_MaDH_fkey';
            columns: ['MaDH'];
            isOneToOne: false;
            referencedRelation: 'DONHANG';
            referencedColumns: ['MaDH'];
          },
        ];
      };
      VOUCHER: {
        Row: {
          created_at: string;
          Dieukien: number;
          FreeShip: boolean;
          MaVoucher: string;
          MoTa: string | null;
          NgayBatDau: string;
          NgayKetThuc: string;
          SoTien: number;
          TenVoucher: string;
          TrangThai: Database['public']['Enums']['TrangThai'];
        };
        Insert: {
          created_at?: string;
          Dieukien?: number;
          FreeShip?: boolean;
          MaVoucher: string;
          MoTa?: string | null;
          NgayBatDau: string;
          NgayKetThuc: string;
          SoTien?: number;
          TenVoucher: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
        };
        Update: {
          created_at?: string;
          Dieukien?: number;
          FreeShip?: boolean;
          MaVoucher?: string;
          MoTa?: string | null;
          NgayBatDau?: string;
          NgayKetThuc?: string;
          SoTien?: number;
          TenVoucher?: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
        };
        Relationships: [];
      };
      VOUCHER_KHACHHANG: {
        Row: {
          created_at: string;
          MaTKKH: string;
          MaVCKH: string;
          MaVoucher: string;
          TrangThai: Database['public']['Enums']['TrangThai'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          MaTKKH: string;
          MaVCKH: string;
          MaVoucher: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          MaTKKH?: string;
          MaVCKH?: string;
          MaVoucher?: string;
          TrangThai?: Database['public']['Enums']['TrangThai'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'VOUCHER_KHACHHANG_MaTKKH_fkey';
            columns: ['MaTKKH'];
            isOneToOne: false;
            referencedRelation: 'TAIKHOAN';
            referencedColumns: ['MaTK'];
          },
          {
            foreignKeyName: 'VOUCHER_KHACHHANG_MaVoucher_fkey';
            columns: ['MaVoucher'];
            isOneToOne: false;
            referencedRelation: 'VOUCHER';
            referencedColumns: ['MaVoucher'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      KichCo: 'S' | 'M' | 'L' | 'XL' | 'XXL';
      LoaiDanhMuc: 'NAM' | 'NU' | 'PHU_KIEN';
      TrangThai: 'ACTIVE' | 'INACTIVE';
      TrangThaiDonHang:
        | 'CHUA_GIAO'
        | 'DANG_GIAO'
        | 'DA_GIAO'
        | 'HUY'
        | 'LOI'
        | 'XAC_NHAN_LOI';
      TrangThaiPhieuNhapHang:
        | 'DANG_CHO'
        | 'NCC_XACNHAN'
        | 'NV_XACNHAN'
        | 'TU_CHOI';
      TrangThaiSP: 'CON_HANG' | 'HET_HANG' | 'TAM_NGUNG';
      VaiTro: 'KH' | 'NCC' | 'QLDN' | 'NVVH' | 'NVCSKH' | 'ADMIN';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      KichCo: ['S', 'M', 'L', 'XL', 'XXL'],
      LoaiDanhMuc: ['NAM', 'NU', 'PHU_KIEN'],
      TrangThai: ['ACTIVE', 'INACTIVE'],
      TrangThaiDonHang: [
        'CHUA_GIAO',
        'DANG_GIAO',
        'DA_GIAO',
        'HUY',
        'LOI',
        'XAC_NHAN_LOI',
      ],
      TrangThaiPhieuNhapHang: [
        'DANG_CHO',
        'NCC_XACNHAN',
        'NV_XACNHAN',
        'TU_CHOI',
      ],
      TrangThaiSP: ['CON_HANG', 'HET_HANG', 'TAM_NGUNG'],
      VaiTro: ['KH', 'NCC', 'QLDN', 'NVVH', 'NVCSKH', 'ADMIN'],
    },
  },
} as const;
