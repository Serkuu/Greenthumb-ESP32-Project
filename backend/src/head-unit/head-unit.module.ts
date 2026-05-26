import { Module } from '@nestjs/common';
import { HeadUnitService } from './head-unit.service';
import { HeadUnitController } from './head-unit.controller';

@Module({
  controllers: [HeadUnitController],
  providers: [HeadUnitService],
})
export class HeadUnitModule {}
