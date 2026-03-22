import { Test, TestingModule } from '@nestjs/testing';
import { SuKienUuDaiController } from './sukienuudai.controller';
import { SuKienUuDaiService } from './sukienuudai.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from '../../modules/taikhoan/taikhoan.guard';

describe('SuKienUuDaiController', () => {
  let controller: SuKienUuDaiController;
  let service: SuKienUuDaiService;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    addSuKienUuDai: jest.fn(),
    updateSuKienUuDai: jest.fn(),
    changeStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuKienUuDaiController],
      providers: [
        { provide: SuKienUuDaiService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SuKienUuDaiController>(SuKienUuDaiController);
    service = module.get<SuKienUuDaiService>(SuKienUuDaiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should call service.getAll', async () => {
      mockService.getAll.mockResolvedValue([]);
      const result = await controller.getAll();
      expect(result).toEqual([]);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('addSuKienUuDai', () => {
    it('should call service.addSuKienUuDai', async () => {
      const dto = { TenSK: 'New' } as any;
      await controller.addSuKienUuDai(dto);
      expect(service.addSuKienUuDai).toHaveBeenCalledWith(dto);
    });
  });
});
