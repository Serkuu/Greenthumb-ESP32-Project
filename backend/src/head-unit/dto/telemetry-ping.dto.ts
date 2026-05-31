import { IsInt, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class TelemetryPingDto {
    @IsString()
    @IsOptional()
    apiKey?: string;

    @IsString()
    @IsNotEmpty()
    macAddress: string;

    @IsInt()
    @IsNotEmpty()
    tempLevel: number;

    @IsInt()
    @IsNotEmpty()
    moistLevel: number;

    @IsInt()
    @IsOptional()
    batteryLevel?: number;
}
