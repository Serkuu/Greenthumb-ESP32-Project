import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(201)
    @Post('register')
    register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }
}
