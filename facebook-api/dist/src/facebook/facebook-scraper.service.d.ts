import { TransformedAd } from './models/FacebookInterfaces';
import { Browser, Page } from 'puppeteer';
import { AwsService } from './aws.service';
import { AdScreenshot } from './models/ScraperInterfaces';
export declare class FacebookScraperService {
    private awsService;
    constructor(awsService: AwsService);
    scrapFacebook(ads: TransformedAd[], brandName: string, best_ads_limit: number): Promise<TransformedAd[]>;
    initBrowser(headless?: boolean): Promise<{
        browser: Browser;
        page: Page;
    }>;
    findBestAds(ads: TransformedAd[], numberOfAds: number): TransformedAd[];
    getFacebookCallToActionUrl(adSnapshotUrl: string, page: Page): Promise<string | null>;
    getAdScreenshot(page: Page, url: string, brandName: string, number: number): Promise<AdScreenshot>;
    getFacebookLandingPageScreenshot(page: Page, landingPageUrl: string, brandName: string, index: number): Promise<string | null>;
    acceptCookiesFacebook(page: Page): Promise<boolean>;
    cleanLandingPageUrl(dirtyURL: string): string;
}
