import { Test, TestingModule } from '@nestjs/testing';
import { QuanLyController } from './quanly.controller';
import { TaikhoanService } from './taikhoan.service';
import { JwtAuthGuard } from '../../modules/jwt/jwt.guard';
import { TaiKhoanGuard } from './taikhoan.guard';

describe('QuanLyController', () => {
    let controller: QuanLyController;
    let service: TaikhoanService;

    const mockService = {
        dangKyQL: jest.fn(),
        taikhoansQL: jest.fn(),
        taikhoan: jest.fn(),
        updateTaiKhoan: jest.fn(),
        updateTrangThai: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuanLyController],
            providers: [
                { provide: TaikhoanService, useValue: mockService },
            ],
        })
            .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
            .overrideGuard(TaiKhoanGuard).useValue({ canActivate: () => true })
            .compile();

        controller = module.get<QuanLyController>(QuanLyController);
        service = module.get<TaikhoanService>(TaikhoanService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllQL', () => {
        it('should call service.taikhoansQL', async () => {
            mockService.taikhoansQL.mockResolvedValue([]);
            const result = await controller.getAllQL();
            expect(result).toEqual([]);
            expect(service.taikhoansQL).toHaveBeenCalled();
        });
    });

    describe('getQL', () => {
        it('should return QLDN if role matches', async () => {
            const mockResult = { MaTK: '1', VAITRO: 'QLDN' };
            mockService.taikhoan.mockResolvedValue(mockResult);

            const result = await controller.getQL('1');
            expect(result).toEqual(mockResult);
        });

        it('should throw if role does not match', async () => {
            mockService.taikhoan.mockResolvedValue({ MaTK: '1', VAITRO: 'KH' });
            await expect(controller.getQL('1')).rejects.toThrow();
        });
    });
});
