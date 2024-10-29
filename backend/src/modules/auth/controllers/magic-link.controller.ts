import { Controller, Post, Body } from '@nestjs/common';
import { MagicLinkUseCase } from '../services/magic-link.service';

@Controller('auth') 
export class MagicLinkController {
  constructor(private authService: MagicLinkUseCase) {}

  @Post('magic-link')
  async createMagicLink(@Body('email') email: string) {
    await this.authService.execute(email);
    return { message: 'Magic link sent to your email' };
  }
}