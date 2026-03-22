import { Module } from '@nestjs/common';
import { DonhangController } from './donhang.controller';
import { DonhangService } from './donhang.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { DonhangRepository } from 'src/common/repositories/donhang.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DonhangController],
  providers: [DonhangService, DonhangRepository],
  exports: [DonhangService, DonhangRepository],
})
export class DonhangModule {
  constructor() {
    console.log('[DonhangModule] Registered with Repository pattern');
  }
}
