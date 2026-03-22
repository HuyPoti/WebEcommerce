import { Test, TestingModule } from '@nestjs/testing';
import { ThongbaoService } from './thongbao.service';
import { ThongbaoRepository } from '../../common/repositories/thongbao.repository';
import { BadRequestException } from '@nestjs/common';

describe('ThongbaoService', () => {
  let service: ThongbaoService;
  let repository: ThongbaoRepository;

  const mockRepository = {
    findAllSK: jest.fn(),
    findAllVC: jest.fn(),
    createThongBao: jest.fn(),
    deleteById: jest.fn(),
    deleteByLoai: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThongbaoService,
        { provide: ThongbaoRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ThongbaoService>(ThongbaoService);
    repository = module.get<ThongbaoRepository>(ThongbaoRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateThongBaoSK', () => {
    it('should create new notifications for empty MaTB', async () => {
      const dtos = [{ MaTB: '', Loai: 'SUKIENUUDAI', MaSK: 'SK1' }] as any;
      mockRepository.createThongBao.mockResolvedValue({ MaTB: 'NEW1' });
      mockRepository.findAllSK.mockResolvedValue([]);

      await service.updateThongBaoSK(dtos);
      expect(repository.createThongBao).toHaveBeenCalledWith('SUKIENUUDAI', 'SK1', undefined);
    });

    it('should throw if creation fails', async () => {
      const dtos = [{ MaTB: '', Loai: 'SUKIENUUDAI', MaSK: 'SK1' }] as any;
      mockRepository.createThongBao.mockResolvedValue(null);
      await expect(service.updateThongBaoSK(dtos)).rejects.toThrow(BadRequestException);
    });
  });
});
