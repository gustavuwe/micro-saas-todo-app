import { Module } from '@nestjs/common';

import { MagicLinkUseCase } from './services/magic-link.service';
import { VerifyUseCase } from './services/verify.service';
import { VerifyController } from './controllers/verify.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../lib/prisma.service';
import { MagicLinkController } from './controllers/magic-link.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [MagicLinkController, VerifyController],
  providers: [MagicLinkUseCase, VerifyUseCase, PrismaService],
})
export class AuthModule {}