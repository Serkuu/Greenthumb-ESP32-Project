import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/(?=.*[A-Z])(?=.*\d)/, { message: 'Hasło musi zawierać przynajmniej jedną dużą literę i cyfrę' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Nickname must be at least 3 characters long' })
  @MaxLength(20, { message: 'Nickname must be at most 20 characters long' })
  nickname: string;
}
