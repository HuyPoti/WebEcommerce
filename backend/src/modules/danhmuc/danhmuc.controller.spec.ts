import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucController } from './danhmuc.controller';
import { DanhMucService } from './danhmuc.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from '../../modules/taikhoan/taikhoan.guard';

describe('DanhMucController', () => {
  let controller: DanhMucController;
  let service: DanhMucService;

  const mockService = {
    getAllDanhMuc: jest.fn(),
    getDanhMucById: jest.fn(),
    addDanhMuc: jest.fn(),
    updateDanhMuc: jest.fn(),
    changeTrangThai: jest.fn(),
    changeLoai: jest.fn(),
    exportDanhMucToExcel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanhMucController],
      providers: [
        { provide: DanhMucService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DanhMucController>(DanhMucController);
    service = module.get<DanhMucService>(DanhMucService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllDanhMuc', () => {
    it('should call service.getAllDanhMuc', async () => {
      mockService.getAllDanhMuc.mockResolvedValue([]);
      const result = await controller.getAllDanhMuc();
      expect(result).toEqual([]);
      expect(service.getAllDanhMuc).toHaveBeenCalled();
    });
  });

  describe('addDanhMuc', () => {
    it('should call service.addDanhMuc', async () => {
      const dto = { TenDM: 'New' } as any;
      await controller.addDanhMuc(dto);
      expect(service.addDanhMuc).toHaveBeenCalledWith(dto);
    });
  });
});
