import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(201)
    @Post('register')
    register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }

    @HttpCode(200)
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtGuard)
    @Get('test-ochrony')
    testTokena(@Req() req) {
        return { message: "Witaj w pokoju VIP!", profil: req.user };
    }

}
