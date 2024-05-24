import { NestFactory } from '@nestjs/core';

import 'dotenv/config';
import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS

  app.useGlobalGuards(new ApiKeyGuard(new ConfigService())); // Create an instance of ApiKeyGuard
  await app.listen(3001);
}
bootstrap();
