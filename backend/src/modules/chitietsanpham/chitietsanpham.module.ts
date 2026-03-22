import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ChitietsanphamController } from './chitietsanpham.controller';
import { ChitietsanphamService } from './chitietsanpham.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChitietsanphamController],
  providers: [ChitietsanphamService],
})
export class ChitietsanphamModule {}
