import { IsInt, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class TelemetryPingDto {
    @IsString()
    @IsNotEmpty()
    macAddress: string;

    @IsInt()
    @IsNotEmpty()
    moistureLevel: number;

    @IsInt()
    @IsOptional()
    batteryLevel?: number;
}
