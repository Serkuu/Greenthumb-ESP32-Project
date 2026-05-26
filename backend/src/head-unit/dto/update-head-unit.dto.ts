import { PartialType } from '@nestjs/mapped-types';
import { CreateHeadUnitDto } from './create-head-unit.dto';

export class UpdateHeadUnitDto extends PartialType(CreateHeadUnitDto) {}
