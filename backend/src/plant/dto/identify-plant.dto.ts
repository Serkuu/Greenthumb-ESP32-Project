import { IsNotEmpty, IsString } from "class-validator";

export class IdentifyPlantDto {
    @IsNotEmpty()
    @IsString()
    base64Image: string;
}
