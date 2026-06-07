import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateHeadUnitDto } from './dto/create-head-unit.dto';
import { UpdateHeadUnitDto } from './dto/update-head-unit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelemetryPingDto } from './dto/telemetry-ping.dto';

@Injectable()
export class HeadUnitService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createHeadUnitDto: CreateHeadUnitDto, userId: number) {
    if (createHeadUnitDto.gardenId) {
      const garden = await this.prisma.garden.findFirst({
        where: { id: createHeadUnitDto.gardenId, userId: userId }
      });
      if (!garden) {
        throw new ForbiddenException("This garden does not exist or does not belong to you.");
      }
    }
    return this.prisma.headUnit.create({
      data: {
        macAddress: createHeadUnitDto.macAddress,
        userId: userId,
        gardenId: createHeadUnitDto.gardenId
      }
    });
  }

  findAll(userId: number) {
    return this.prisma.headUnit.findMany({
      where: { userId },
      include: { 
        garden: true,
        history: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
  }

  async findOne(id: number, userId: number) {
    const headUnit = await this.prisma.headUnit.findFirst({
      where: { id, userId },
      include: {
        garden: true,
        history: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    if (!headUnit) throw new ForbiddenException("This head unit does not exist or does not belong to you.");
    return headUnit;
  }

  async update(id: number, updateHeadUnitDto: UpdateHeadUnitDto, userId: number) {
    const headUnit = await this.prisma.headUnit.findFirst({
      where: { id, userId }
    });
    if (!headUnit) throw new ForbiddenException("This head unit does not exist or does not belong to you.");

    if (updateHeadUnitDto.gardenId) {
      const garden = await this.prisma.garden.findFirst({
        where: { id: updateHeadUnitDto.gardenId, userId }
      });
      if (!garden) throw new ForbiddenException("This garden does not exist or does not belong to you.");
    }

    return this.prisma.headUnit.update({
      where: { id },
      data: { ...updateHeadUnitDto }
    });
  }

  async remove(id: number, userId: number) {
    const headUnit = await this.prisma.headUnit.findFirst({
      where: { id, userId }
    });
    if (!headUnit) throw new ForbiddenException("This head unit does not exist or does not belong to you.");

    await this.prisma.environmentHistory.deleteMany({
      where: { headUnitId: id }
    });

    return this.prisma.headUnit.delete({
      where: { id }
    });
  }

  async getHistory(id: number, userId: number, period: string) {
    const headUnit = await this.prisma.headUnit.findFirst({
      where: { id, userId }
    });
    if (!headUnit) throw new ForbiddenException("This head unit does not exist or does not belong to you.");

    const now = new Date();
    let startDate = new Date();

    if (period === '1h') startDate.setHours(now.getHours() - 1);
    else if (period === '1d') startDate.setDate(now.getDate() - 1);
    else if (period === '1w') startDate.setDate(now.getDate() - 7);
    else if (period === '1m') startDate.setMonth(now.getMonth() - 1);
    else startDate.setDate(now.getDate() - 1); // default to 1 day

    return this.prisma.environmentHistory.findMany({
      where: {
        headUnitId: id,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async saveTelemetry(telemetryDto: TelemetryPingDto) {
    const headUnit = await this.prisma.headUnit.findUnique({
      where: { macAddress: telemetryDto.macAddress }
    });

    if (!headUnit) {
      throw new ForbiddenException("Unknown head unit. Device with this MAC has not been registered.");
    }

    return this.prisma.environmentHistory.create({
      data: {
        tempLevel: telemetryDto.tempLevel,
        moistLevel: telemetryDto.moistLevel,
        headUnitId: headUnit.id,
        batteryLevel: telemetryDto.batteryLevel
      }
    });
  }
}
