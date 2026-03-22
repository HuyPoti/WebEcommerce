import { Test, TestingModule } from '@nestjs/testing';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from '../../modules/taikhoan/taikhoan.guard';

describe('VoucherController', () => {
  let controller: VoucherController;
  let service: VoucherService;

  const mockService = {
    getAllVouchers: jest.fn(),
    getVoucherById: jest.fn(),
    getVoucherByCode: jest.fn(),
    addVoucher: jest.fn(),
    updateVoucher: jest.fn(),
    changeStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [
        { provide: VoucherService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VoucherController>(VoucherController);
    service = module.get<VoucherService>(VoucherService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVoucherByCode', () => {
    it('should call service.getVoucherByCode', async () => {
      mockService.getVoucherByCode.mockResolvedValue({ id: 'V1' });
      const result = await controller.getVoucherByCode('CODE1');
      expect(result).toEqual({ id: 'V1' });
      expect(service.getVoucherByCode).toHaveBeenCalledWith('CODE1');
    });
  });

  describe('addVoucher', () => {
    it('should call service.addVoucher', async () => {
      const dto = { Code: 'V1' } as any;
      await controller.addVoucher(dto);
      expect(service.addVoucher).toHaveBeenCalledWith(dto);
    });
  });
});
