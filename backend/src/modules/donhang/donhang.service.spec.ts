import { Test, TestingModule } from '@nestjs/testing';
import { DonhangService } from './donhang.service';
import { DonhangRepository } from '../../common/repositories/donhang.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TrangThaiDonHang } from './dto/donhang.dto';

describe('DonhangService', () => {
  let service: DonhangService;
  let repository: DonhangRepository;

  const mockRepository = {
    getProductDetail: jest.fn(),
    createOrder: jest.fn(),
    updateProductStock: jest.fn(),
    findAllOrdersForCustomer: jest.fn(),
    findOrderById: jest.fn(),
    updateOrderStatus: jest.fn(),
    restoreProductStock: jest.fn(),
    cancelOrder: jest.fn(),
    deleteOrder: jest.fn(),
  };

  const mockOrder = {
    MaDH: '1',
    SoLuong: 1,
    TongTien: 100,
    CHITIETSANPHAM: { MaCTSP: 'P1', SANPHAM: { MaSP: 'SP1' } },
    TINHTRANGDONHANG: [{ TrangThai: TrangThaiDonHang.CHUA_GIAO }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonhangService,
        { provide: DonhangRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<DonhangService>(DonhangService);
    repository = module.get<DonhangRepository>(DonhangRepository);
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should throw if product not found', async () => {
      mockRepository.getProductDetail.mockResolvedValue(null);
      await expect(service.createOrder({ MaCTSP: 'P1' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if stock insufficient', async () => {
      mockRepository.getProductDetail.mockResolvedValue({ SoLuong: 1 });
      await expect(service.createOrder({ MaCTSP: 'P1', SoLuong: 5 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should create order successfully', async () => {
      mockRepository.getProductDetail.mockResolvedValue({ SoLuong: 10, TrangThaiSP: 'CON_HANG' });
      mockRepository.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder({ MaCTSP: 'P1', SoLuong: 1 } as any);
      expect(result.MaDH).toBe('1');
      expect(mockRepository.updateProductStock).toHaveBeenCalled();
    });
  });

  describe('cancelOrder', () => {
    it('should throw if order already delivered', async () => {
      mockRepository.findOrderById.mockResolvedValue({
        ...mockOrder,
        TINHTRANGDONHANG: [{ TrangThai: TrangThaiDonHang.DA_GIAO }]
      });
      await expect(service.cancelOrder('1')).rejects.toThrow(BadRequestException);
    });

    it('should restore stock and cancel order', async () => {
      mockRepository.findOrderById.mockResolvedValue(mockOrder);
      mockRepository.cancelOrder.mockResolvedValue({ ...mockOrder, TINHTRANGDONHANG: [{ TrangThai: TrangThaiDonHang.HUY }] });

      await service.cancelOrder('1');
      expect(mockRepository.restoreProductStock).toHaveBeenCalled();
      expect(mockRepository.cancelOrder).toHaveBeenCalled();
    });
  });
});
