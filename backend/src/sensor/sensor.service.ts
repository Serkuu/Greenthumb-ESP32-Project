import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { TelemetryPingDto } from './dto/telemetry-ping.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) { }

  async create(createSensorDto: CreateSensorDto, userId: number) {
    if (createSensorDto.plantId) {
      const plant = await this.prisma.plant.findFirst({
        where: { id: createSensorDto.plantId, userId: userId }
      });

      if (!plant) {
        throw new ForbiddenException("This plant does not exist or does not belong to you.");
      }
    }
    return this.prisma.moistureSensor.create({
      data: {
        macAddress: createSensorDto.macAddress,
        userId: userId,
        plantId: createSensorDto.plantId
      }
    });
  }

  findAll(userId: number) {
    return this.prisma.moistureSensor.findMany({
      where: { userId },
      include: { 
        plant: true,
        history: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
  }

  async findOne(id: number, userId: number) {
    const sensor = await this.prisma.moistureSensor.findFirst({
      where: { id, userId },
      include: {
        plant: true,
        history: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    if (!sensor) throw new ForbiddenException("This sensor does not exist or does not belong to you.");
    return sensor;
  }

  async update(id: number, updateSensorDto: UpdateSensorDto, userId: number) {
    const sensor = await this.prisma.moistureSensor.findFirst({
      where: { id, userId }
    });
    if (!sensor) throw new ForbiddenException("This sensor does not exist or does not belong to you.");

    if (updateSensorDto.plantId) {
      const plant = await this.prisma.plant.findFirst({
        where: { id: updateSensorDto.plantId, userId }
      });
      if (!plant) throw new ForbiddenException("This plant does not exist or does not belong to you.");
    }

    return this.prisma.moistureSensor.update({
      where: { id },
      data: { ...updateSensorDto }
    });
  }

  async remove(id: number, userId: number) {
    const sensor = await this.prisma.moistureSensor.findFirst({
      where: { id, userId }
    });
    if (!sensor) throw new ForbiddenException("This sensor does not exist or does not belong to you.");

    await this.prisma.moistureHistory.deleteMany({
      where: { sensorId: id }
    });

    return this.prisma.moistureSensor.delete({
      where: { id }
    });
  }

  async getHistory(id: number, userId: number, period: string) {
    const sensor = await this.prisma.moistureSensor.findFirst({
      where: { id, userId }
    });
    if (!sensor) throw new ForbiddenException("This sensor does not exist or does not belong to you.");

    const now = new Date();
    let startDate = new Date();

    if (period === '1h') startDate.setHours(now.getHours() - 1);
    else if (period === '1d') startDate.setDate(now.getDate() - 1);
    else if (period === '1w') startDate.setDate(now.getDate() - 7);
    else if (period === '1m') startDate.setMonth(now.getMonth() - 1);
    else startDate.setDate(now.getDate() - 1); // default to 1 day

    return this.prisma.moistureHistory.findMany({
      where: {
        sensorId: id,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async saveTelemetry(telemetryDto: TelemetryPingDto) {
    const sensor = await this.prisma.moistureSensor.findUnique({
      where: { macAddress: telemetryDto.macAddress }
    });

    if (!sensor) {
      throw new ForbiddenException("Unknown sensor. Device with this MAC has not been registered.");
    }

    return this.prisma.moistureHistory.create({
      data: {
        moistureLevel: telemetryDto.moistureLevel,
        batteryLevel: telemetryDto.batteryLevel,
        sensorId: sensor.id
      }
    });
  }
}
