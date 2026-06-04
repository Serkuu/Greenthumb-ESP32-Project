import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HeadUnitService } from './head-unit.service';
import { CreateHeadUnitDto } from './dto/create-head-unit.dto';
import { UpdateHeadUnitDto } from './dto/update-head-unit.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiKeyGuard } from '../auth/guard/api-key/api-key.guard';
import { TelemetryPingDto } from './dto/telemetry-ping.dto';

@Controller('head-unit')
export class HeadUnitController {
  constructor(private readonly headUnitService: HeadUnitService) { }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createHeadUnitDto: CreateHeadUnitDto, @GetUser('userId') userId: number) {
    return this.headUnitService.create(createHeadUnitDto, userId);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@GetUser('userId') userId: number) {
    return this.headUnitService.findAll(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.headUnitService.findOne(+id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeadUnitDto: UpdateHeadUnitDto, @GetUser('userId') userId: number) {
    return this.headUnitService.update(+id, updateHeadUnitDto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.headUnitService.remove(+id, userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/history')
  getHistory(@Param('id') id: string, @Query('period') period: string, @GetUser('userId') userId: number) {
    return this.headUnitService.getHistory(+id, userId, period);
  }

  @UseGuards(ApiKeyGuard)
  @Post('telemetry')
  saveTelemetry(@Body() telemetryPingDto: TelemetryPingDto) {
    return this.headUnitService.saveTelemetry(telemetryPingDto);
  }
}
