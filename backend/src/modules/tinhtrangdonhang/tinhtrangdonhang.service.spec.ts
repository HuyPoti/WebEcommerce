import { Test, TestingModule } from '@nestjs/testing';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import { TinhtrangDonhangRepository } from '../../common/repositories/tinhtrangdonhang.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TrangThaiDonHang } from './dto/tinhtrangdonhang.dto';

describe('TinhtrangDonhangService', () => {
  let service: TinhtrangDonhangService;
  let repository: TinhtrangDonhangRepository;

  const mockRepository = {
    orderExists: jest.fn(),
    createOrderStatus: jest.fn(),
    getOrder: jest.fn(),
    getCurrentOrderStatus: jest.fn(),
    updateOrderStatus: jest.fn(),
    findOrderStatusById: jest.fn(),
    getOrderStatusHistory: jest.fn(),
    deleteOrderStatus: jest.fn(),
    deleteAllOrderStatuses: jest.fn(),
    getOrderStatusStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TinhtrangDonhangService,
        { provide: TinhtrangDonhangRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TinhtrangDonhangService>(TinhtrangDonhangService);
    repository = module.get<TinhtrangDonhangRepository>(TinhtrangDonhangRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrderStatus', () => {
    it('should create status successfully', async () => {
      mockRepository.orderExists.mockResolvedValue(true);
      const mockResult = { MaTTDH: '1', TrangThai: TrangThaiDonHang.CHUA_GIAO, MaDH: 'DH1' };
      mockRepository.createOrderStatus.mockResolvedValue(mockResult);

      const result = await service.createOrderStatus({ MaDH: 'DH1', TrangThai: TrangThaiDonHang.CHUA_GIAO });
      expect(result.TrangThai).toBe(TrangThaiDonHang.CHUA_GIAO);
    });

    it('should throw NotFound if order missing', async () => {
      mockRepository.orderExists.mockResolvedValue(false);
      await expect(service.createOrderStatus({ MaDH: 'MISSING', TrangThai: TrangThaiDonHang.CHUA_GIAO })).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrderStatus transition validation', () => {
    it('should throw BadRequest for invalid transition', async () => {
      mockRepository.getOrder.mockResolvedValue({ MaDH: 'DH1' });
      mockRepository.getCurrentOrderStatus.mockResolvedValue({ TrangThai: TrangThaiDonHang.CHUA_GIAO });

      // CHUA_GIAO cannot go to DA_GIAO directly (must go to DANG_GIAO first according to service logic)
      await expect(service.updateOrderStatus('DH1', { TrangThai: TrangThaiDonHang.DA_GIAO })).rejects.toThrow(BadRequestException);
    });

    it('should work for valid transition', async () => {
      mockRepository.getOrder.mockResolvedValue({ MaDH: 'DH1' });
      mockRepository.getCurrentOrderStatus.mockResolvedValue({ TrangThai: TrangThaiDonHang.CHUA_GIAO });
      mockRepository.updateOrderStatus.mockResolvedValue({ MaTTDH: '2', TrangThai: TrangThaiDonHang.DANG_GIAO });

      const result = await service.updateOrderStatus('DH1', { TrangThai: TrangThaiDonHang.DANG_GIAO });
      expect(result.TrangThai).toBe(TrangThaiDonHang.DANG_GIAO);
    });
  });
});
