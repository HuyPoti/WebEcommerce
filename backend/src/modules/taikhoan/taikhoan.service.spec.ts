import { Test, TestingModule } from '@nestjs/testing';
import { TaikhoanService } from './taikhoan.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { GiohangRepository } from '../../common/repositories/giohang.repository';
import { AuditService } from '../audit/audit.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import * as supabase from '@supabase/supabase-js';

// Global mock supabase
const mockSupabaseInstance = {
  auth: {
    signUp: jest.fn(),
    admin: {
      updateUserById: jest.fn(),
    },
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseInstance),
}));

describe('TaikhoanService', () => {
  let service: TaikhoanService;
  let prisma: PrismaService;
  let giohangRepo: GiohangRepository;
  let auditService: AuditService;

  const mockPrisma = {
    tAIKHOAN: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockGiohangRepo = {
    createCart: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'http://localhost:54321';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaikhoanService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: GiohangRepository, useValue: mockGiohangRepo },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<TaikhoanService>(TaikhoanService);
    prisma = module.get<PrismaService>(PrismaService);
    giohangRepo = module.get<GiohangRepository>(GiohangRepository);
    auditService = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  describe('dangKy', () => {
    it('should throw if user exists', async () => {
      mockPrisma.tAIKHOAN.findFirst.mockResolvedValue({ MaTK: '1' });
      await expect(service.dangKy({ Username: 'test' } as any)).rejects.toThrow(ConflictException);
    });

    it('should create user and cart successfully', async () => {
      mockPrisma.tAIKHOAN.findFirst.mockResolvedValue(null);
      mockSupabaseInstance.auth.signUp.mockResolvedValue({ data: { user: { id: 'uuid-123' } }, error: null });
      mockPrisma.tAIKHOAN.create.mockResolvedValue({ MaTK: 'uuid-123', Username: 'test' });

      const result = await service.dangKy({ Username: 'test', Email: 't@t.com', MatKhau: '123456' } as any);

      expect(result.MaTK).toBe('uuid-123');
      expect(prisma.tAIKHOAN.create).toHaveBeenCalled();
      expect(giohangRepo.createCart).toHaveBeenCalledWith({ MaTKKH: 'uuid-123' });
    });
  });

  describe('updateTrangThai', () => {
    it('should update status and log audit', async () => {
      mockPrisma.tAIKHOAN.update.mockResolvedValue({ MaTK: '1', Status: 'INACTIVE' });

      const result = await service.updateTrangThai('1', 'INACTIVE');
      expect(result.Status).toBe('INACTIVE');
      expect(auditService.log).toHaveBeenCalledWith(expect.objectContaining({
        maTK: '1',
        hanhDong: 'UPDATE_STATUS',
      }));
    });
  });
});
