import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateHeadUnitDto } from './create-head-unit.dto';

export class UpdateHeadUnitDto extends PartialType(OmitType(CreateHeadUnitDto, ['macAddress'] as const)) { }
