import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MagicLinkUseCase {
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

  async execute(email: string): Promise<void> {
    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });
    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

    // Store the token in the database
    await this.prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    // Send email
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your Magic Link',
      html: `Click <a href="${magicLink}">here</a> to login. This link expires in 15 minutes.`,
    });
  }
}