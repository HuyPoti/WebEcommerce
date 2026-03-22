import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    async log(params: {
        maTK?: string;
        hanhDong: string;
        module: string;
        chiTiet?: string;
        ip?: string;
        userAgent?: string;
    }) {
        try {
            await this.prisma.aUDIT_LOG.create({
                data: {
                    MaTK: params.maTK,
                    HanhDong: params.hanhDong,
                    Module: params.module,
                    ChiTiet: params.chiTiet,
                    IP: params.ip,
                    UserAgent: params.userAgent,
                },
            });
        } catch (error) {
            console.error('Failed to save audit log:', error);
        }
    }
}
