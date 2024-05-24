import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiKeyGuard } from './api-key.guard';
import { CompanyController } from './company.controller';
import { CompanyService } from './company/company.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available in your app
    }),
  ],
  controllers: [CompanyController],
  providers: [ApiKeyGuard, CompanyService],
})
export class CompanyModule {}
