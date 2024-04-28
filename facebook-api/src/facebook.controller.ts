import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';

import { FacebookAdsService } from './facebook/Facebook-ads.service';
import { FacebookScraperService } from './facebook/facebook-scraper.service';
import { OpenAIService } from './facebook/openai.service';
import { ReportService } from './facebook/report.service';

@Controller('facebook')
export class FacebookController {
  constructor(
    private facebookAdsService: FacebookAdsService,
    private facebookScraper: FacebookScraperService,
    private facebookOpenai: OpenAIService,
    private facebookReport: ReportService,
  ) {}

  @Get()
  async getHello(): Promise<void> {
    await  this.facebookAdsService.getHello();
     return  
  }
  @Post('analyze')
  async analyzeFacebook(@Body() body: any, @Res() res: Response) {
    try {
      const { pageName, best_ads_limit, ad_reached_countries, email } = body;
      const pageId = await this.facebookAdsService.getPageId(pageName);
      // Fetch ads
      const { ads, brandName } = await this.facebookAdsService.getRawAds(
        ad_reached_countries,
        pageId,
        best_ads_limit,
      );

      if (ads.length === 0) {
        return res
          .status(HttpStatus.NO_CONTENT)
          .json({ message: 'No ads found', success: false });
      }

      const newAds = await this.facebookScraper.scrapFacebook(
        ads,
        brandName,
        best_ads_limit,
      );

      const analysisResults = await this.facebookOpenai.analyzeAds(
        newAds,
        brandName,
      );
 

      // Generate report
      const reportUrl = await this.facebookReport.makeReport(
        brandName,
        analysisResults,
      );
      res.status(HttpStatus.CREATED).json({
        message: 'Report generated successfully',
        reportUrl,
        success: true,
      });
    } catch (error) {
      console.error('Error during Facebook analysis:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to complete analysis', success: false });
    }
  }
}
