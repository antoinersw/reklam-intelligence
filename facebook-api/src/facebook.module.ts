import { Module } from '@nestjs/common';
import { FacebookController } from './facebook.controller';
import { ConfigModule } from '@nestjs/config';

import { FacebookScraperService } from './facebook/facebook-scraper.service';
import { OpenAIService } from './facebook/openai.service';
import { ReportService } from './facebook/report.service';
import { FacebookAdsService } from './facebook/Facebook-ads.service';
import { ApiKeyGuard } from './api-key.guard';
import { AwsService } from './facebook/aws.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available in your app
    }),
  ],
  controllers: [FacebookController],
  providers: [
    ApiKeyGuard,
    FacebookAdsService,
    FacebookScraperService,
    OpenAIService,
    ReportService,
    AwsService
  ],
})
export class FacebookModule {}
