import { Test, TestingModule } from '@nestjs/testing';
import { PhanHoiService } from './phanhoi.service';
import { PhanHoiRepository } from '../../common/repositories/phanhoi.repository';
import { SanPhamRepository } from '../../common/repositories/sanpham.repository';

describe('PhanHoiService', () => {
  let service: PhanHoiService;
  let repository: PhanHoiRepository;
  let spRepository: SanPhamRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findAllCustomer: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    getCustomerFeedback: jest.fn(),
    getCustomerFeedbackForNV: jest.fn(),
    delete: jest.fn(),
  };

  const mockSpRepository = {
    findSPBySlug: jest.fn(),
    findSPByID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhanHoiService,
        { provide: PhanHoiRepository, useValue: mockRepository },
        { provide: SanPhamRepository, useValue: mockSpRepository },
      ],
    }).compile();

    service = module.get<PhanHoiService>(PhanHoiService);
    repository = module.get<PhanHoiRepository>(PhanHoiRepository);
    spRepository = module.get<SanPhamRepository>(SanPhamRepository);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should throw if product not found', async () => {
      mockSpRepository.findSPBySlug.mockResolvedValue(null);
      await expect(service.findAll('slug')).rejects.toThrow();
    });

    it('should return feedbacks', async () => {
      mockSpRepository.findSPBySlug.mockResolvedValue({ MaSP: 'SP1' });
      mockRepository.findAll.mockResolvedValue([{ MaTKKH: 'U1' }]);
      mockRepository.findAllCustomer.mockResolvedValue([{ MaTK: 'U1' }]);

      const result = await service.findAll('slug');
      expect(result.feedbacks).toHaveLength(1);
      expect(repository.findAll).toHaveBeenCalledWith('SP1');
    });
  });

  describe('delete', () => {
    it('should throw if feedback not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.delete('PH1')).rejects.toThrow();
    });

    it('should call repository.delete', async () => {
      mockRepository.findById.mockResolvedValue({ MaPH: 'PH1' });
      await service.delete('PH1');
      expect(repository.delete).toHaveBeenCalledWith('PH1');
    });
  });
});
