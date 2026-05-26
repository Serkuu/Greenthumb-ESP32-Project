import { IsInt, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateSensorDto {
    @IsString()
    @IsNotEmpty()
    macAddress: string;

    @IsInt()
    @IsOptional()
    plantId: number;
}
