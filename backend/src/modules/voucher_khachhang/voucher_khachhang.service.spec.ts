import { Test, TestingModule } from '@nestjs/testing';
import { VoucherKhachHangService } from './voucher_khachhang.service';
import { VoucherKhachHangRepository } from '../../common/repositories/voucher_khachhang.repository';
import { VoucherRepository } from '../../common/repositories/voucher.repository';
import { BadRequestException } from '@nestjs/common';
import { TrangThai } from '../../common/constant';

describe('VoucherKhachHangService', () => {
  let service: VoucherKhachHangService;
  let vkhRepository: VoucherKhachHangRepository;
  let vRepository: VoucherRepository;

  const mockVkhRepository = {
    useVoucher: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    add: jest.fn(),
    updateVoucherStatus: jest.fn(),
    findVoucherForCustomer: jest.fn(),
    findByVoucherAndUser: jest.fn(),
    inactiveVoucherStatus: jest.fn(),
  };

  const mockVRepository = {
    getVoucherById: jest.fn(),
    updateVoucher: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherKhachHangService,
        { provide: VoucherKhachHangRepository, useValue: mockVkhRepository },
        { provide: VoucherRepository, useValue: mockVRepository },
      ],
    }).compile();

    service = module.get<VoucherKhachHangService>(VoucherKhachHangService);
    vkhRepository = module.get<VoucherKhachHangRepository>(VoucherKhachHangRepository);
    vRepository = module.get<VoucherRepository>(VoucherRepository);
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should throw if voucher not found', async () => {
      mockVRepository.getVoucherById.mockResolvedValue(null);
      await expect(service.add('U1', 'V1')).rejects.toThrow(BadRequestException);
    });

    it('should throw if voucher out of stock', async () => {
      mockVRepository.getVoucherById.mockResolvedValue({ MaVoucher: 'V1', SoLuong: 0 });
      await expect(service.add('U1', 'V1')).rejects.toThrow(/hết số lượng/i);
    });

    it('should throw if already owned', async () => {
      const mockVoucher = {
        MaVoucher: 'V1',
        SoLuong: 10,
        NgayBatDau: new Date(2000),
        NgayKetThuc: new Date(2100),
        TrangThai: TrangThai.ACTIVE
      };
      mockVRepository.getVoucherById.mockResolvedValue(mockVoucher);
      mockVkhRepository.findVoucherForCustomer.mockResolvedValue({ id: 'X' });

      await expect(service.add('U1', 'V1')).rejects.toThrow(/đã sở hữu/i);
    });

    it('should add successfully', async () => {
      const mockVoucher = {
        MaVoucher: 'V1',
        SoLuong: 10,
        NgayBatDau: new Date(2000),
        NgayKetThuc: new Date(2100),
        TrangThai: TrangThai.ACTIVE
      };
      mockVRepository.getVoucherById.mockResolvedValue(mockVoucher);
      mockVkhRepository.findVoucherForCustomer.mockResolvedValue(null);
      mockVkhRepository.add.mockResolvedValue({ MaVCKH: 'NEW' });

      const result = await service.add('U1', 'V1');
      expect(result.MaVCKH).toBe('NEW');
      expect(vRepository.updateVoucher).toHaveBeenCalled();
    });
  });
});
