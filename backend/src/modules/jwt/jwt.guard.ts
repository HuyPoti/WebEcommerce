import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/types';
import { PrismaService } from '../../common/prisma/prisma.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('YÃªu cáº§u Token xÃ¡c thá»±c (Bearer)');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data?.user) {
        throw new UnauthorizedException('Token khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n');
      }

      const dbUser = await this.prisma.tAIKHOAN.findUnique({
        where: { MaTK: data.user.id },
        select: { MaTK: true, VAITRO: true, Status: true }
      });

      if (!dbUser) {
        throw new UnauthorizedException('TÃ i khoáº£n chÆ°a Ä‘Æ°á»£c kÃ­ch hoáº¡t trÃªn há»‡ thá»‘ng');
      }

      if (dbUser.Status === 'INACTIVE') {
        throw new UnauthorizedException('TÃ i khoáº£n nÃ y Ä‘Ã£ bá»‹ khÃ³a');
      }

      // Populate request user with consistent structure
      request.user = {
        id: dbUser.MaTK,
        role: dbUser.VAITRO,
        email: data.user.email,
        auth_level: 'verified'
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Lá»—i xÃ¡c thá»±c há»‡ thá»‘ng');
    }
  }
}
