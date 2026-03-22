import { Test, TestingModule } from '@nestjs/testing';
import { DonhangRepository } from './donhang.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('DonhangRepository', () => {
    let repository: DonhangRepository;
    let prisma: PrismaService;

    const mockPrisma = {
        dONHANG: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
            delete: jest.fn(),
        },
        tINHTRANGDONHANG: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
        cHITIETSANPHAM: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DonhangRepository,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        repository = module.get<DonhangRepository>(DonhangRepository);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('createOrder', () => {
        it('should call prisma.dONHANG.create', async () => {
            const dto = { MaDH: '1', SoLuong: 2 } as any;
            mockPrisma.dONHANG.create.mockResolvedValue({ MaDH: '1' });
            await repository.createOrder(dto);
            expect(prisma.dONHANG.create).toHaveBeenCalled();
        });
    });

    describe('updateProductStock', () => {
        it('should decrease stock and update status', async () => {
            mockPrisma.cHITIETSANPHAM.findUnique.mockResolvedValue({ MaCTSP: '1', SoLuong: 10, TrangThaiSP: 'CON_HANG' });
            mockPrisma.cHITIETSANPHAM.update.mockResolvedValue({ MaCTSP: '1', SoLuong: 8 });

            await repository.updateProductStock('1', 2);
            expect(prisma.cHITIETSANPHAM.update).toHaveBeenCalledWith({
                where: { MaCTSP: '1' },
                data: { SoLuong: 8, TrangThaiSP: 'CON_HANG' },
            });
        });

        it('should set HET_HANG if stock reaches zero', async () => {
            mockPrisma.cHITIETSANPHAM.findUnique.mockResolvedValue({ MaCTSP: '1', SoLuong: 2, TrangThaiSP: 'CON_HANG' });
            mockPrisma.cHITIETSANPHAM.update.mockResolvedValue({ MaCTSP: '1', SoLuong: 0 });

            await repository.updateProductStock('1', 2);
            expect(prisma.cHITIETSANPHAM.update).toHaveBeenCalledWith({
                where: { MaCTSP: '1' },
                data: { SoLuong: 0, TrangThaiSP: 'HET_HANG' },
            });
        });
    });
});
