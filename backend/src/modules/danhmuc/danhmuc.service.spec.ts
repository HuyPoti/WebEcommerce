import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucService } from './danhmuc.service';
import { DanhMucRepository } from '../../common/repositories/danhmuc.repository';
import { ExcelService } from './excel.service';
import { BadRequestException } from '@nestjs/common';

describe('DanhMucService', () => {
  let service: DanhMucService;
  let repository: DanhMucRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    createDanhMuc: jest.fn(),
    updateDanhMuc: jest.fn(),
    changeTrangThai: jest.fn(),
    changeLoai: jest.fn(),
  };

  const mockExcel = {
    generateToExcel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DanhMucService,
        { provide: DanhMucRepository, useValue: mockRepository },
        { provide: ExcelService, useValue: mockExcel },
      ],
    }).compile();

    service = module.get<DanhMucService>(DanhMucService);
    repository = module.get<DanhMucRepository>(DanhMucRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDanhMucById', () => {
    it('should return category if exists', async () => {
      const mockDM = { MaDM: '1', TenDM: 'Category 1' };
      mockRepository.findById.mockResolvedValue(mockDM);

      const result = await service.getDanhMucById('1');
      expect(result).toEqual(mockDM);
    });

    it('should throw BadRequestException if category does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.getDanhMucById('99')).rejects.toThrow(BadRequestException);
    });
  });

  describe('addDanhMuc', () => {
    it('should add category if name is unique', async () => {
      const dto = { TenDM: 'New Category' } as any;
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.createDanhMuc.mockResolvedValue({ MaDM: '2', ...dto });

      const result = await service.addDanhMuc(dto);
      expect(result.TenDM).toBe('New Category');
      expect(repository.createDanhMuc).toHaveBeenCalledWith(dto);
    });

    it('should throw if name already exists', async () => {
      mockRepository.findByName.mockResolvedValue({ MaDM: '1', TenDM: 'Existing' });
      await expect(service.addDanhMuc({ TenDM: 'Existing' } as any)).rejects.toThrow(BadRequestException);
    });
  });
});
