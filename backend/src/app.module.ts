import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GardenModule } from './garden/garden.module';
import { PlantModule } from './plant/plant.module';
import { SensorModule } from './sensor/sensor.module';
import { HeadUnitModule } from './head-unit/head-unit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    GardenModule,
    PlantModule,
    SensorModule,
    HeadUnitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
