import { Test, TestingModule } from '@nestjs/testing';
import { SanphamService } from './sanpham.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotFoundException } from '@nestjs/common';

describe('SanphamService', () => {
  let service: SanphamService;
  let prisma: PrismaService;
  let auditService: AuditService;

  const mockPrisma = {
    sANPHAM: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SanphamService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<SanphamService>(SanphamService);
    prisma = module.get<PrismaService>(PrismaService);
    auditService = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  describe('sanpham', () => {
    it('should call prisma.sANPHAM.findFirst', async () => {
      mockPrisma.sANPHAM.findFirst.mockResolvedValue({ MaSP: '1' });
      const result = await service.sanpham('slug-1');
      expect(result.MaSP).toBe('1');
      expect(prisma.sANPHAM.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: { slug: 'slug-1' },
      }));
    });
  });

  describe('createSanpham', () => {
    it('should create product and log audit', async () => {
      const dto = { TenSP: 'Product 1', MaDM: 'DM1' } as any;
      mockPrisma.sANPHAM.create.mockResolvedValue({ MaSP: 'SP1', TenSP: 'Product 1' });

      const result = await service.createSanpham(dto);
      expect(result.MaSP).toBe('SP1');
      expect(auditService.log).toHaveBeenCalledWith(expect.objectContaining({
        hanhDong: 'CREATE_PRODUCT',
      }));
    });
  });

  describe('updateTrangThaiSanPham', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.sANPHAM.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.updateTrangThaiSanPham('invalid', 'INACTIVE')).rejects.toThrow(NotFoundException);
    });

    it('should update status successfully', async () => {
      mockPrisma.sANPHAM.update.mockResolvedValue({ MaSP: 'SP1', TrangThai: 'INACTIVE' });
      await service.updateTrangThaiSanPham('SP1', 'INACTIVE');
      expect(prisma.sANPHAM.update).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalled();
    });
  });
});
