import { Response } from 'express';
import { FacebookAdsService } from './facebook/Facebook-ads.service';
import { FacebookScraperService } from './facebook/facebook-scraper.service';
import { OpenAIService } from './facebook/openai.service';
import { ReportService } from './facebook/report.service';
export declare class FacebookController {
    private facebookAdsService;
    private facebookScraper;
    private facebookOpenai;
    private facebookReport;
    constructor(facebookAdsService: FacebookAdsService, facebookScraper: FacebookScraperService, facebookOpenai: OpenAIService, facebookReport: ReportService);
    analyzeFacebook(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
