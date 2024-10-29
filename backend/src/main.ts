import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './lib/env';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });
  await app.listen(env.PORT);
}
bootstrap();
