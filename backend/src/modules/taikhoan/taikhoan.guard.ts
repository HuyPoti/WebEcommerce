import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from '@supabase/supabase-js';

@Injectable()
export class TaiKhoanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;

    if (!user) throw new ForbiddenException('User not authenticated');

    // âœ… Fetch TAIKHOAN using Supabase UID
    const taiKhoan = await this.prisma.tAIKHOAN.findUnique({
      where: { MaTK: user.id },
      select: { VAITRO: true },
    });

    if (!taiKhoan) {
      throw new ForbiddenException('KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n');
    }

    if (!roles.includes(taiKhoan.VAITRO)) {
      throw new ForbiddenException('User khÃ´ng cÃ³ quyá»n');
    }
    return true;
  }
}
