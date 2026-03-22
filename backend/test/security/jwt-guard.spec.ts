import { JwtAuthGuard } from '../../src/modules/jwt/jwt.guard';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn(),
        },
    })),
}));

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let prisma: PrismaService;
    let supabaseMock: any;

    beforeEach(() => {
        prisma = {
            tAIKHOAN: {
                findUnique: jest.fn(),
            },
        } as any;
        guard = new JwtAuthGuard(prisma);
        supabaseMock = (createClient as jest.Mock)();
    });

    it('should throw Unauthorized if token is missing', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({ headers: {} }),
            }),
        } as ExecutionContext;

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if user is INACTIVE', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer valid-token' },
                }),
            }),
        } as ExecutionContext;

        supabaseMock.auth.getUser.mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@test.com' } },
            error: null,
        });

        (prisma.tAIKHOAN.findUnique as jest.Mock).mockResolvedValue({
            MaTK: 'user-123',
            VAITRO: 'KH',
            Status: 'INACTIVE',
        });

        await expect(guard.canActivate(context)).rejects.toThrow('TÃ i khoáº£n nÃ y Ä‘Ã£ bá»‹ khÃ³a');
    });

    it('should allow active user and populate request.user', async () => {
        const request: any = {
            headers: { authorization: 'Bearer valid-token' },
        };
        const context = {
            switchToHttp: () => ({
                getRequest: () => request,
            }),
        } as ExecutionContext;

        supabaseMock.auth.getUser.mockResolvedValue({
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
