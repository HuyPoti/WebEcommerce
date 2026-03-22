import { Test, TestingModule } from '@nestjs/testing';
import { SuKienUuDaiService } from './sukienuudai.service';
import { SuKienUuDaiRepository } from '../../common/repositories/sukienuudai.repository';
import { BadRequestException } from '@nestjs/common';
import { TrangThai } from '../../common/constant';

describe('SuKienUuDaiService', () => {
  let service: SuKienUuDaiService;
  let repository: SuKienUuDaiRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    changeTrangThai: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuKienUuDaiService,
        { provide: SuKienUuDaiRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<SuKienUuDaiService>(SuKienUuDaiService);
    repository = module.get<SuKienUuDaiRepository>(SuKienUuDaiRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should deactivate expired events', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);
      const mockEvents = [{ MaSK: 'SK1', NgayKT: expiredDate, TrangThai: TrangThai.ACTIVE }];
      mockRepository.findAll.mockResolvedValue(mockEvents);

      await service.getAll();
      expect(repository.changeTrangThai).toHaveBeenCalledWith('SK1', TrangThai.INACTIVE);
    });
  });

  describe('isEventActive', () => {
    it('should return true for active event in range', async () => {
      const now = new Date();
      const start = new Date(now.getTime() - 100000);
      const end = new Date(now.getTime() + 100000);
      mockRepository.findById.mockResolvedValue({ NgayPH: start, NgayKT: end, TrangThai: TrangThai.ACTIVE });

      const result = await service.isEventActive('SK1');
      expect(result).toBe(true);
    });

    it('should return false for inactive event even in range', async () => {
      mockRepository.findById.mockResolvedValue({ TrangThai: TrangThai.INACTIVE });
      const result = await service.isEventActive('SK1');
      expect(result).toBe(false);
    });
  });
});
