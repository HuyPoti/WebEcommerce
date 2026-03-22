import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response.decorator';

export interface Response<T> {
    statusCode: number;
    message?: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) { }

    private sanitize(data: any): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map((item) => this.sanitize(item));
        }

        const sensitiveKeys = ['password', 'MatKhau', 'token', 'secret', 'key', 'MatKhauMoi'];
        const sanitizedData = { ...data };

        for (const key in sanitizedData) {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
                delete sanitizedData[key];
            } else if (typeof sanitizedData[key] === 'object') {
                sanitizedData[key] = this.sanitize(sanitizedData[key]);
            }
        }

        return sanitizedData;
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler(),) || '',
                    data: this.sanitize(data),
                })),
            );
    }
}

