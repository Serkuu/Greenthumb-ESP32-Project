import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateGardenDto {
    @IsNotEmpty()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(30, { message: 'Name must be at most 30 characters long' })
    @IsString()
    gardenName: string;
}
