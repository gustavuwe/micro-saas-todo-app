import { Controller, Get, Query } from '@nestjs/common';
import { VerifyUseCase } from '../services/verify.service';

@Controller('auth')
export class VerifyController {
  constructor(private authService: VerifyUseCase) {}

  @Get('verify')
  async verifyToken(@Query('token') token: string) {
    const user = await this.authService.execute(token);
    return user;
  }
}