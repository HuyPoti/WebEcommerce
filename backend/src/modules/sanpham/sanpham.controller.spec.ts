import { Test, TestingModule } from '@nestjs/testing';
import { SanphamController } from './sanpham.controller';
import { SanphamService } from './sanpham.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from '../../modules/taikhoan/taikhoan.guard';

describe('SanphamController', () => {
  let controller: SanphamController;
  let service: SanphamService;

  const mockService = {
    sanphams: jest.fn(),
    sanpham: jest.fn(),
    findRelated: jest.fn(),
    createSanpham: jest.fn(),
    updateSanPham: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SanphamController],
      providers: [
        { provide: SanphamService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SanphamController>(SanphamController);
    service = module.get<SanphamService>(SanphamService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service with correct params', async () => {
      mockService.sanphams.mockResolvedValue([]);
      await controller.findAll('0', '10', 'true', 'cat1', 'type1', 'test');

      expect(service.sanphams).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
        includeSizes: true,
        loaiDM: 'type1',
      }));
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockResult = { MaSP: '1', TenSP: 'Test' };
      mockService.sanpham.mockResolvedValue(mockResult);

      const result = await controller.findOne('test-slug');
      expect(result).toEqual(mockResult);
      expect(service.sanpham).toHaveBeenCalledWith('test-slug');
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { TenSP: 'New' } as any;
      mockService.createSanpham.mockResolvedValue({ MaSP: '1', ...dto });

      const result = await controller.create(dto);
      expect(result.MaSP).toBe('1');
      expect(service.createSanpham).toHaveBeenCalledWith(dto);
    });
  });
});
