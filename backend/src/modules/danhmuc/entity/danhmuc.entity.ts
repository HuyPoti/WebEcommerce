import { TrangThai, LoaiDanhMuc } from 'src/common/constant';
export class DanhMucEntity {
  MaDM: string;
  TenDM: string;
  TrangThai: TrangThai;
  Loai: LoaiDanhMuc;
  constructor(
    MaDM: string,
    TenDM: string,
    TrangThai: TrangThai,
    Loai: LoaiDanhMuc,
  ) {
    this.MaDM = MaDM;
    this.TenDM = TenDM;
    this.TrangThai = TrangThai;
    this.Loai = Loai;
  }
}
