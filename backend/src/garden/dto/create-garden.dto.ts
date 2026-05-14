import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateGardenDto {
    @IsNotEmpty()
    @MinLength(3, { message: 'Nazwa musi zawierać minimum 3 znaki' })
    @MaxLength(30, { message: 'Nazwa musi zawierać maksimum 30 znaków' })
    @IsString()
    gardenName: string;
}
