import { Test, TestingModule } from '@nestjs/testing';
import { ChitietsanphamService } from './chitietsanpham.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ChitietsanphamService', () => {
  let service: ChitietsanphamService;
  let prisma: PrismaService;

  const mockPrisma = {
    cHITIETSANPHAM: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChitietsanphamService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ChitietsanphamService>(ChitietsanphamService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chitietsanpham', () => {
    it('should return a detail by unique input', async () => {
      const mockDetail = { MaCTSP: '1', SoLuong: 10 };
      mockPrisma.cHITIETSANPHAM.findUnique.mockResolvedValue(mockDetail);

      const result = await service.chitietsanpham({ MaCTSP: '1' });
      expect(result).toEqual(mockDetail);
    });
  });

  describe('tangSoLuongChitietsanpham', () => {
    it('should increase quantity', async () => {
      const where = { MaCTSP: '1' };
      mockPrisma.cHITIETSANPHAM.findUnique.mockResolvedValue({ MaCTSP: '1', SoLuong: 5 });
      mockPrisma.cHITIETSANPHAM.update.mockResolvedValue({ MaCTSP: '1', SoLuong: 8 });

      const result = await service.tangSoLuongChitietsanpham(where, 3);
      expect(result.SoLuong).toBe(8);
      expect(prisma.cHITIETSANPHAM.update).toHaveBeenCalledWith({
        where,
        data: { SoLuong: 8 },
      });
    });

    it('should throw NotFound if missing', async () => {
      mockPrisma.cHITIETSANPHAM.findUnique.mockResolvedValue(null);
      await expect(service.tangSoLuongChitietsanpham({ MaCTSP: '9' }, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
