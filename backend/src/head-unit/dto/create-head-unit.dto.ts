import { IsString, IsOptional, IsNotEmpty, IsInt } from "class-validator";

export class CreateHeadUnitDto {
    @IsInt()
    @IsOptional()
    gardenId: number;

    @IsString()
    @IsNotEmpty()
    macAddress: string;
}
