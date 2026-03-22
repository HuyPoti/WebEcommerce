import { Test, TestingModule } from '@nestjs/testing';
import { DonhangController } from './donhang.controller';
import { DonhangService } from './donhang.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from '../../modules/taikhoan/taikhoan.guard';

describe('DonhangController', () => {
  let controller: DonhangController;
  let service: DonhangService;

  const mockService = {
    createOrder: jest.fn(),
    getAllOrders: jest.fn(),
    getOrderSummary: jest.fn(),
    getAllOrderForStaff: jest.fn(),
    updateOrderStatus: jest.fn(),
    cancelOrder: jest.fn(),
    getOrderById: jest.fn(),
    addOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonhangController],
      providers: [
        { provide: DonhangService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DonhangController>(DonhangController);
    service = module.get<DonhangService>(DonhangService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call service.createOrder', async () => {
      const dto = { MaDH: '1' } as any;
      mockService.createOrder.mockResolvedValue({ id: '1' });
      const result = await controller.createOrder(dto);
      expect(result).toEqual({ id: '1' });
      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllOrders', () => {
    it('should call service.getAllOrders with defaults', async () => {
      await controller.getAllOrders('user1', 1, 50);
      expect(service.getAllOrders).toHaveBeenCalledWith('user1', 1, 50);
    });
  });

  describe('updateOrderStatus', () => {
    it('should call service.updateOrderStatus', async () => {
      const dto = { TrangThai: 'DA_XAC_NHAN' } as any;
      await controller.updateOrderStatus('DH1', dto);
      expect(service.updateOrderStatus).toHaveBeenCalledWith('DH1', dto);
    });
  });
});
