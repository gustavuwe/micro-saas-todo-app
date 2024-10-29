import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class VerifyUseCase {
  private transporter;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async execute(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const magicLink = await this.prisma.magicLink.findFirst({
        where: {
          token,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!magicLink) {
        throw new Error('Invalid or expired token');
      }

      // Mark token as used
      await this.prisma.magicLink.update({
        where: { id: magicLink.id },
        data: { used: true },
      });

      // Create or update user
      const user = await this.prisma.user.upsert({
        where: { email: decoded.email },
        update: { lastLoginAt: new Date() },
        create: { 
          email: decoded.email,
          lastLoginAt: new Date(),
        },
      });

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}