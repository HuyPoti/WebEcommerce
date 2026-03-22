import { Test, TestingModule } from '@nestjs/testing';
import { GiohangService } from './giohang.service';
import { GiohangRepository } from '../../common/repositories/giohang.repository';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GiohangService', () => {
  let service: GiohangService;
  let repository: GiohangRepository;
  let prisma: PrismaService;

  const mockRepository = {
    createCart: jest.fn(),
    findCartByUserId: jest.fn(),
    findCartItemByProductDetail: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    createCartItem: jest.fn(),
    findAllCartItems: jest.fn(),
    deleteCartItem: jest.fn(),
    deleteAllCartItems: jest.fn(),
  };

  const mockPrisma = {
    cHITIETSANPHAM: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiohangService,
        { provide: GiohangRepository, useValue: mockRepository },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GiohangService>(GiohangService);
    repository = module.get<GiohangRepository>(GiohangRepository);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should call repository.createCart', async () => {
      mockRepository.createCart.mockResolvedValue({ MaGH: 'GH1' });
      const result = await service.createCart('user1');
      expect(result).toEqual({ MaGH: 'GH1' });
      expect(repository.createCart).toHaveBeenCalledWith({ MaTKKH: 'user1' });
    });
  });

  describe('updateCart', () => {
    it('should throw BadRequest if cart not found', async () => {
      mockRepository.findCartByUserId.mockResolvedValue(null);
      await expect(service.updateCart('user1', [])).rejects.toThrow(BadRequestException);
    });

    it('should clear cart if dto is empty', async () => {
      mockRepository.findCartByUserId.mockResolvedValue({ MaGH: 'GH1' });
      const result = await service.updateCart('user1', []);
      expect(repository.deleteAllCartItems).toHaveBeenCalledWith('GH1');
      expect(result.message).toBeDefined();
    });

    it('should update existing items and add new ones', async () => {
      mockRepository.findCartByUserId.mockResolvedValue({ MaGH: 'GH1' });
      mockPrisma.cHITIETSANPHAM.findFirst.mockResolvedValue({ MaCTSP: 'P1', SoLuong: 10 });
      mockRepository.findCartItemByProductDetail.mockResolvedValue({ MaCTGH: 'ITEM1' });
      mockRepository.findAllCartItems.mockResolvedValue([]);

      const dto = [{ MaCTSP: 'P1', SoLuong: 2 }];
      const result = await service.updateCart('user1', dto);

      expect(repository.updateCartItemQuantity).toHaveBeenCalledWith('ITEM1', 2);
      expect(result.message).toBeDefined();
    });

    it('should throw BadRequest if stock is insufficient', async () => {
      mockRepository.findCartByUserId.mockResolvedValue({ MaGH: 'GH1' });
      mockPrisma.cHITIETSANPHAM.findFirst.mockResolvedValue({ MaCTSP: 'P1', SoLuong: 1 });

      const dto = [{ MaCTSP: 'P1', SoLuong: 5 }];
      await expect(service.updateCart('user1', dto)).rejects.toThrow(BadRequestException);
    });
  });
});
