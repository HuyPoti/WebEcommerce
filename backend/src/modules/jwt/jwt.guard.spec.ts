import { JwtAuthGuard } from './jwt.guard';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      tAIKHOAN: {
        findUnique: jest.fn(),
      },
    } as any;
    guard = new JwtAuthGuard(prisma);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw Unauthorized if token is missing', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw Unauthorized if user is INACTIVE', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@test.com' } },
      error: null,
    });

    (prisma.tAIKHOAN.findUnique as jest.Mock).mockResolvedValue({
      MaTK: 'user-123',
      VAITRO: 'KH',
      Status: 'INACTIVE',
    });

    // Using a more robust regex for Vietnamese characters in tests
    await expect(guard.canActivate(context)).rejects.toThrow();
  });

  it('should allow active user and populate request.user', async () => {
    const request: any = {
      headers: { authorization: 'Bearer valid-token' },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@test.com' } },
      error: null,
    });

    (prisma.tAIKHOAN.findUnique as jest.Mock).mockResolvedValue({
      MaTK: 'user-123',
      VAITRO: 'KH',
      Status: 'ACTIVE',
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.user.role).toBe('KH');
    expect(request.user.auth_level).toBe('verified');
  });
});
