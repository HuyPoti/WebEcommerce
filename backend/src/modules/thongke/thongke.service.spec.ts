import { Test, TestingModule } from '@nestjs/testing';
import { ThongkeService } from './thongke.service';
import { ThongkeRepository } from '../../common/repositories/thongke.repository';

describe('ThongkeService', () => {
  let service: ThongkeService;
  let repository: ThongkeRepository;

  const mockRepository = {
    getDoanhThu: jest.fn(),
    getSLKhachHang: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThongkeService,
        { provide: ThongkeRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ThongkeService>(ThongkeService);
    repository = module.get<ThongkeRepository>(ThongkeRepository);
    jest.clearAllMocks();
  });

  describe('getDoanhThu', () => {
    it('should call repository.getDoanhThu', async () => {
      mockRepository.getDoanhThu.mockResolvedValue([]);
      await service.getDoanhThu();
      expect(repository.getDoanhThu).toHaveBeenCalled();
    });
  });

  describe('getSLKhachHang', () => {
    it('should call repository.getSLKhachHang', async () => {
      mockRepository.getSLKhachHang.mockResolvedValue([]);
      await service.getSLKhachHang();
      expect(repository.getSLKhachHang).toHaveBeenCalled();
    });
  });
});
