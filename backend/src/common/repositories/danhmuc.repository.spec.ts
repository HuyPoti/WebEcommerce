import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucRepository } from './danhmuc.repository';
import { PrismaService } from '../prisma/prisma.service';
import { DanhMucMapper } from '../../modules/danhmuc/entity/danhmuc.mapper';

jest.mock('../../modules/danhmuc/entity/danhmuc.mapper', () => ({
    DanhMucMapper: {
        toEntityList: jest.fn((val) => val),
        toEntity: jest.fn((val) => val),
    },
}));

describe('DanhMucRepository', () => {
    let repository: DanhMucRepository;
    let prisma: PrismaService;

    const mockPrisma = {
        dANHMUC: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DanhMucRepository,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        repository = module.get<DanhMucRepository>(DanhMucRepository);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findAll', () => {
        it('should return mapped entities', async () => {
            const mockResult = [{ MaDM: '1' }];
            mockPrisma.dANHMUC.findMany.mockResolvedValue(mockResult);

            const result = await repository.findAll();
            expect(result).toEqual(mockResult);
            expect(DanhMucMapper.toEntityList).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return null if not found', async () => {
            mockPrisma.dANHMUC.findUnique.mockResolvedValue(null);
            const result = await repository.findById('999');
            expect(result).toBeNull();
        });
    });
});
