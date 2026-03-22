import { Test, TestingModule } from '@nestjs/testing';
import { PaypalService } from './paypal.service';

describe('PaypalService', () => {
    let service: PaypalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PaypalService],
        }).compile();

        service = module.get<PaypalService>(PaypalService);

        // Mock global fetch
        global.fetch = jest.fn();
        process.env.PAYPAL_CLIENT_ID = 'id';
        process.env.PAYPAL_CLIENT_SECRET = 'secret';
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAccessToken', () => {
        it('should return access token on success', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ access_token: 'valid_token' }),
            });

            const token = await service.getAccessToken();
            expect(token).toBe('valid_token');
        });

        it('should throw on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 401,
                text: jest.fn().mockResolvedValue('Unauthorized'),
            });

            await expect(service.getAccessToken()).rejects.toThrow(/Failed to get PayPal access token/);
        });
    });
});
