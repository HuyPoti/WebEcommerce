import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { VoucherRepository } from '../../common/repositories/voucher.repository';
import { ExcelService } from './excel.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('VoucherService', () => {
  let service: VoucherService;
  let repository: VoucherRepository;

  const mockRepository = {
    getAllVouchers: jest.fn(),
    getVoucherById: jest.fn(),
    getVoucherByCode: jest.fn(),
    getVoucherByName: jest.fn(),
    checkVoucherCode: jest.fn(),
    addVoucher: jest.fn(),
    updateVoucher: jest.fn(),
    changeStatus: jest.fn(),
  };

  const mockExcel = {
    generateToExcel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        { provide: VoucherRepository, useValue: mockRepository },
        { provide: ExcelService, useValue: mockExcel },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    repository = module.get<VoucherRepository>(VoucherRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVoucherByCode', () => {
    it('should return voucher if code exists', async () => {
      const mockVoucher = { Code: 'SAVE10', TenVoucher: 'Save 10' };
      mockRepository.getVoucherByCode.mockResolvedValue(mockVoucher);

      const result = await service.getVoucherByCode('SAVE10');
      expect(result).toEqual(mockVoucher);
    });

    it('should throw BadRequest if code not found', async () => {
      mockRepository.getVoucherByCode.mockResolvedValue(null);
      await expect(service.getVoucherByCode('INVALID')).rejects.toThrow(BadRequestException);
    });
  });

  describe('addVoucher', () => {
    it('should add voucher if unique', async () => {
      const dto = { Code: 'NEW', TenVoucher: 'New' } as any;
      mockRepository.getVoucherByName.mockResolvedValue(null);
      mockRepository.checkVoucherCode.mockResolvedValue(null);
      mockRepository.addVoucher.mockResolvedValue({ MaVoucher: 'V1', ...dto });

      const result = await service.addVoucher(dto);
      expect(result.MaVoucher).toBe('V1');
    });

    it('should throw if code exists', async () => {
      mockRepository.getVoucherByName.mockResolvedValue(null);
      mockRepository.checkVoucherCode.mockResolvedValue({ MaVoucher: 'V1' });
      await expect(service.addVoucher({ Code: 'V1' } as any)).rejects.toThrow(BadRequestException);
    });
  });
});
