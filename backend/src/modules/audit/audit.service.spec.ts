import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('AuditService', () => {
    let service: AuditService;
    let prisma: PrismaService;

    const mockPrisma = {
        aUDIT_LOG: {
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<AuditService>(AuditService);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('log', () => {
        it('should create an audit log entry', async () => {
            const logParams = {
                maTK: 'user1',
                hanhDong: 'TEST_ACTION',
                module: 'TEST_MODULE',
                chiTiet: 'details',
            };

            await service.log(logParams);

            expect(prisma.aUDIT_LOG.create).toHaveBeenCalledWith({
                data: {
                    MaTK: 'user1',
                    HanhDong: 'TEST_ACTION',
                    Module: 'TEST_MODULE',
                    ChiTiet: 'details',
                    IP: undefined,
                    UserAgent: undefined,
                },
            });
        });

        it('should not throw if prisma create fails', async () => {
            mockPrisma.aUDIT_LOG.create.mockRejectedValue(new Error('DB Error'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(service.log({ hanhDong: 'fail', module: 'fail' })).resolves.not.toThrow();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
