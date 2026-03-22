import { Test, TestingModule } from '@nestjs/testing';
import { ThanhtoanService } from './thanhtoan.service';
import { ThanhtoanRepository } from '../../common/repositories/thanhtoan.repository';
import { DonhangRepository } from '../../common/repositories/donhang.repository';
import { BadRequestException } from '@nestjs/common';

describe('ThanhtoanService', () => {
  let service: ThanhtoanService;
  let repository: ThanhtoanRepository;
  let orderRepository: DonhangRepository;

  const mockRepository = {
    createPayment: jest.fn(),
    findAllPayments: jest.fn(),
    findPaymentDetailById: jest.fn(),
  };

  const mockOrderRepository = {
    findOrderById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThanhtoanService,
        { provide: ThanhtoanRepository, useValue: mockRepository },
        { provide: DonhangRepository, useValue: mockOrderRepository },
      ],
    }).compile();

    service = module.get<ThanhtoanService>(ThanhtoanService);
    repository = module.get<ThanhtoanRepository>(ThanhtoanRepository);
    orderRepository = module.get<DonhangRepository>(DonhangRepository);
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should throw if order not found', async () => {
      mockOrderRepository.findOrderById.mockResolvedValue(null);
      await expect(service.createPayment({ MaDH: 'invalid' } as any)).rejects.toThrow(BadRequestException);
    });

    it('should call repository.createPayment', async () => {
      mockOrderRepository.findOrderById.mockResolvedValue({ MaDH: '1' });
      mockRepository.createPayment.mockResolvedValue({ MaTTDH: 'PAY1' });

      const result = await service.createPayment({ MaDH: '1' } as any);
      expect(result.MaTTDH).toBe('PAY1');
      expect(repository.createPayment).toHaveBeenCalled();
    });
  });
});
