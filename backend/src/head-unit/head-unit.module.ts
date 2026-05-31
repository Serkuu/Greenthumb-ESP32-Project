import { Module } from '@nestjs/common';
import { HeadUnitService } from './head-unit.service';
import { HeadUnitController } from './head-unit.controller';
import { HeadUnitGateway } from './head-unit.gateway';

@Module({
  controllers: [HeadUnitController],
  providers: [HeadUnitService, HeadUnitGateway],
})
export class HeadUnitModule {}
