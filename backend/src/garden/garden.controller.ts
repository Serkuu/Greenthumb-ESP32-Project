import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GardenService } from './garden.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtGuard)
@Controller('garden')
export class GardenController {
  constructor(private readonly gardenService: GardenService) { }

  @Post()
  create(@Body() createGardenDto: CreateGardenDto, @GetUser('userId') userId: number) {
    return this.gardenService.create(createGardenDto, userId);
  }

  @Get()
  findAll(@GetUser('userId') userId: number) {
    return this.gardenService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.gardenService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGardenDto: UpdateGardenDto, @GetUser('userId') userId: number) {
    return this.gardenService.update(+id, updateGardenDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.gardenService.remove(+id, userId);
  }
}
