import { Module } from '@nestjs/common';
import { FacebookModule } from './facebook.module';
import { CompanyModule } from './company.module';

@Module({
  imports: [FacebookModule, CompanyModule],
})
export class AppModule {}
