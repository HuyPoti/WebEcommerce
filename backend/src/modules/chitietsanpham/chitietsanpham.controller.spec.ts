import { Test, TestingModule } from '@nestjs/testing';
import { ChitietsanphamController } from './chitietsanpham.controller';
import { ChitietsanphamService } from './chitietsanpham.service';

describe('ChitietsanphamController', () => {
  let controller: ChitietsanphamController;
  let service: ChitietsanphamService;

  const mockService = {
    chitietsanphams: jest.fn(),
    chitietsanpham: jest.fn(),
    createChitietsanpham: jest.fn(),
    deleteChitietsanpham: jest.fn(),
    updateChitietsanpham: jest.fn(),
    tangSoLuongChitietsanpham: jest.fn(),
    giamSoLuongChitietsanpham: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChitietsanphamController],
      providers: [
        { provide: ChitietsanphamService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ChitietsanphamController>(ChitietsanphamController);
    service = module.get<ChitietsanphamService>(ChitietsanphamService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.chitietsanphams with corect params', async () => {
      await controller.findAll('10', '0');
      expect(service.chitietsanphams).toHaveBeenCalledWith({ take: 10, skip: 0 });
    });
  });

  describe('tangSoLuong', () => {
    it('should call service.tangSoLuongChitietsanpham', async () => {
      await controller.tangSoLuong('1', 5);
      expect(service.tangSoLuongChitietsanpham).toHaveBeenCalledWith({ MaCTSP: '1' }, 5);
    });
  });
});
