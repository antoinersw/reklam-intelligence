import { NestFactory } from '@nestjs/core';
import { FacebookModule } from './facebook.module';
import 'dotenv/config';
import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(FacebookModule);

  app.enableCors(); // Enable CORS

  app.useGlobalGuards(new ApiKeyGuard(new ConfigService())); // Create an instance of ApiKeyGuard
  await app.listen(3000);
}
bootstrap();
