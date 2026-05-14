import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService,) { }

  async register(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.nickname,
          hash: hash,
        },
      });

      const { hash: temp, ...userWithoutHash } = user;
      return userWithoutHash;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException("Użytkownik o takim adresie email już istnieje");
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException("Błędne dane logowania");
    }

    const pwMatches = await bcrypt.compare(dto.password, user.hash);

    if (!pwMatches) {
      throw new ForbiddenException("Błędne dane logowania");
    }

    const payload = { sub: user.id, email: user.email };

    const token = await this.jwt.signAsync(payload);
    return { access_token: token };
  }

}
