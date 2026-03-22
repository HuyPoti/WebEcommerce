import { ResponseInterceptor } from './response.interceptor';
import { of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, CallHandler } from '@nestjs/common';

describe('ResponseInterceptor', () => {
    let interceptor: ResponseInterceptor<any>;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        interceptor = new ResponseInterceptor(reflector);
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('should mask sensitive fields recursively', (done) => {
        const mockData = {
            id: 1,
            Username: 'testuser',
            MatKhau: 'secret123', // Sensitive
            profile: {
                email: 'test@example.com',
                token: 'abc-jwt-token', // Sensitive
            },
            list: [
                { secret: 'key1' }, // Sensitive
                { name: 'public' }
            ]
        };

        const mockExecutionContext = {
            switchToHttp: () => ({
                getResponse: () => ({ statusCode: 200 }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of(mockData),
        } as CallHandler;

        jest.spyOn(reflector, 'get').mockReturnValue('Success Message');

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
            expect(result.data.MatKhau).toBeUndefined();
            expect(result.data.profile.token).toBeUndefined();
            expect(result.data.list[0].secret).toBeUndefined();
            expect(result.data.id).toBe(1);
            expect(result.data.profile.email).toBe('test@example.com');
            expect(result.data.list[1].name).toBe('public');
            done();
        });
    });
});
