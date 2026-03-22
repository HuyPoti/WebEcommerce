import { Test, TestingModule } from '@nestjs/testing';
import { ThongkeRepository } from './thongke.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('ThongkeRepository', () => {
    let repository: ThongkeRepository;
    let prisma: PrismaService;

    const mockPrisma = {
        tINHTRANGDONHANG: {
            findMany: jest.fn(),
        },
        tAIKHOAN: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ThongkeRepository,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        repository = module.get<ThongkeRepository>(ThongkeRepository);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getDoanhThu', () => {
        it('should call prisma.tINHTRANGDONHANG.findMany with date range', async () => {
            mockPrisma.tINHTRANGDONHANG.findMany.mockResolvedValue([]);
            await repository.getDoanhThu();
            expect(prisma.tINHTRANGDONHANG.findMany).toHaveBeenCalled();
        });
    });

    describe('getSLKhachHang', () => {
        it('should call prisma.tAIKHOAN.findMany', async () => {
            mockPrisma.tAIKHOAN.findMany.mockResolvedValue([]);
            await repository.getSLKhachHang();
            expect(prisma.tAIKHOAN.findMany).toHaveBeenCalled();
        });
    });
});
