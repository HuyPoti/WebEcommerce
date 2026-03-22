import { Test, TestingModule } from '@nestjs/testing';
import { GiohangRepository } from './giohang.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('GiohangRepository', () => {
    let repository: GiohangRepository;
    let prisma: PrismaService;

    const mockPrisma = {
        gIOHANG: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        cHITIETGIOHANG: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GiohangRepository,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        repository = module.get<GiohangRepository>(GiohangRepository);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findCartByUserId', () => {
        it('should call prisma.gIOHANG.findFirst', async () => {
            await repository.findCartByUserId('user1');
            expect(prisma.gIOHANG.findFirst).toHaveBeenCalledWith({
                where: { MaTKKH: 'user1' },
                include: expect.any(Object),
            });
        });
    });

    describe('calculateCartTotal', () => {
        it('should calculate total quantity and value', async () => {
            const mockItems = [
                { SoLuong: 2, CHITIETSANPHAM: { SANPHAM: { GiaBan: 100 } } },
                { SoLuong: 1, CHITIETSANPHAM: { SANPHAM: { GiaBan: 50 } } },
            ];
            mockPrisma.cHITIETGIOHANG.findMany.mockResolvedValue(mockItems);

            const result = await repository.calculateCartTotal('cart1');
            expect(result).toEqual({ totalQuantity: 3, totalValue: 250 });
        });
    });
});
