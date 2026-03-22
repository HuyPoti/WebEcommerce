import { Module } from '@nestjs/common';
import { TinhtrangDonhangController } from './tinhtrangdonhang.controller';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TinhtrangDonhangRepository } from 'src/common/repositories/tinhtrangdonhang.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TinhtrangDonhangController],
  providers: [TinhtrangDonhangService, TinhtrangDonhangRepository],
  exports: [TinhtrangDonhangService, TinhtrangDonhangRepository],
})
export class TinhtrangDonhangModule {
  constructor() {
    console.log('[TinhtrangDonhangModule] Registered with Repository pattern');
  }
}
