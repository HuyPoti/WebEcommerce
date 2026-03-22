import { Test, TestingModule } from '@nestjs/testing';
import { TaiKhoanGuard } from './taikhoan.guard';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('TaiKhoanGuard', () => {
  let guard: TaiKhoanGuard;
  let reflector: Reflector;
  let prisma: PrismaService;

  const mockPrisma = {
    tAIKHOAN: {
      findUnique: jest.fn(),
    },
  };

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaiKhoanGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    guard = module.get<TaiKhoanGuard>(TaiKhoanGuard);
    reflector = module.get<Reflector>(Reflector);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles defined', async () => {
    mockReflector.get.mockReturnValue(null);
    const context = { getHandler: () => ({}) } as ExecutionContext;
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw Forbidden if no user in request', async () => {
    mockReflector.get.mockReturnValue(['ADMIN']);
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: null }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow access if user has required role', async () => {
    mockReflector.get.mockReturnValue(['ADMIN']);
    mockPrisma.tAIKHOAN.findUnique.mockResolvedValue({ VAITRO: 'ADMIN' });
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 'user1' } }),
      }),
    } as unknown as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
  });
});
