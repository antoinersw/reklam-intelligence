import { AdFirstResponse, AdResponse, AdsLibrarySearchParams, CountryCode, GetRawAds, TransformedAd } from './models/FacebookInterfaces';
import { ConfigService } from '@nestjs/config';
import { Browser, Page } from 'puppeteer';
export declare class FacebookAdsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    getRawAds(ad_reached_countries: CountryCode[], search_page_ids: number[], best_ads_limit: number, ads_limit?: number): Promise<GetRawAds>;
    getPageId(pageName: string): Promise<number[]>;
    processAds(ads: AdResponse[]): TransformedAd[];
    fetchAdsLibrary(params: AdsLibrarySearchParams, apiUrl: string): Promise<AdFirstResponse>;
    fetchAdsLibraryByPageId(params: AdsLibrarySearchParams, ads_limit: number): Promise<AdResponse[]>;
    initBrowser(headless?: boolean): Promise<{
        browser: Browser;
        page: Page;
    }>;
}
