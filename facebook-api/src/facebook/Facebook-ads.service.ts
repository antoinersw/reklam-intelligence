import { Injectable, Logger } from '@nestjs/common';
 
 import {
   AdFirstResponse,
  AdResponse,
  AdsLibrarySearchParams,
  CountryCode,
  GetRawAds,
  TransformedAd,
} from './models/FacebookInterfaces';
import { ConfigService } from '@nestjs/config';
 
import { ads_fields } from './constants';
import puppeteer, { Browser, Page } from 'puppeteer';
import sleep from 'src/utils/sleep';

@Injectable()
export class FacebookAdsService {
  private readonly logger = new Logger(FacebookAdsService.name);
  constructor(private configService: ConfigService) {}
  async getRawAds(
    ad_reached_countries: CountryCode[],
    search_page_ids: number[],
    best_ads_limit: number,
    ads_limit = 100,
  ): Promise<GetRawAds> {
    const USER_LONG_TOKEN = this.configService.get<string>('USER_LONG_TOKEN');

    const adsLibraryParams: AdsLibrarySearchParams = {
      ad_reached_countries,
      ad_active_status: 'ACTIVE',
      access_token: USER_LONG_TOKEN as string,
      search_page_ids,
      fields: ads_fields,
    };

    let raw_ads: AdResponse[];
    if (search_page_ids) {
      raw_ads = await this.fetchAdsLibraryByPageId(adsLibraryParams, ads_limit);
    } else {
      return { ads: [], brandName: '', best_ads_limit: 0 };
    }

    const ads = this.processAds(raw_ads);

    if (ads.length === 0) {
      return {
        ads: [],
        best_ads_limit: 0,
        brandName: '',
      };
    }

    return { ads, best_ads_limit, brandName: ads[0].page_name };
  }
  async getPageId(pageName: string): Promise<number[]> {
    pageName = pageName.toLowerCase();
    // Assuming getPageIdByPageName is an async function
    // const getPageIdFromDB = await getPageIdByPageName(pageName);
    // if (getPageIdFromDB) {
    //   return getPageIdFromDB;
    // }

    try {
      const url = `https://facebook.com/${pageName}/about_profile_transparency`;
      const { browser, page } = await this.initBrowser(true);
      await page.goto(url, { waitUntil: 'networkidle2' });

      const xpath =
        '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div[1]/span';
      const element = await page.$eval(
        `xpath/${xpath}`,
        (el) => el.textContent,
      );
      this.logger.debug('Debug page id from function => ', element);
      await browser.close();
      return [parseInt(element as string)];
    } catch (e) {
      this.logger.error('Failed to get page ID via scraping', e);
      return [0];
    }
  }
   processAds  (ads:  AdResponse[]):  TransformedAd[]   {

    const data:  TransformedAd[] = ads.map((ad) => ({
      id: ad.id,
      ad_creation_time: ad.ad_creation_time,
      ad_creative_bodies: ad.ad_creative_bodies?.[0],
      ad_creative_link_captions: ad.ad_creative_link_captions?.[0],
      ad_creative_link_titles: ad.ad_creative_link_titles?.[0],
      ad_delivery_start_time: ad.ad_delivery_start_time,
      ad_snapshot_url: ad.ad_snapshot_url,
      age_country_gender_reach_breakdown: ad.age_country_gender_reach_breakdown,
      beneficiary_payers: ad.beneficiary_payers,
      eu_total_reach: ad.eu_total_reach,
      age_gender_breakdowns: ad.age_gender_breakdowns,
      languages: ad.languages?.[0],
      page_id: ad.page_id,
      page_name: ad.page_name,
      publisher_platforms: ad.publisher_platforms,
      target_ages: ad.target_ages,
      target_gender: ad.target_gender,
      target_locations: ad.target_locations,
      creative_src: null, // Add default value if property is missing
      full_ad_src: null, // Add this property
      callToActionUrl: null, // Add default value if property is missing
      landing_page_src: null, // Add default value if property is missing
    }));
  
    return data;
  };
  async fetchAdsLibrary (
    params: AdsLibrarySearchParams,
    apiUrl: string,
  ): Promise<AdFirstResponse>  {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof AdsLibrarySearchParams];
      if (Array.isArray(value) || typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  
    const url = `${apiUrl}${queryParams}`;
    console.log('URL IS =>', url);
    try {
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data: ', error);
      throw error;
    }
  };

  async fetchAdsLibraryByPageId (
    params: AdsLibrarySearchParams,
    ads_limit: number,
  ): Promise<AdResponse[]>   {
    const apiVersion = 'v19.0';
    const baseApiUrl = `https://graph.facebook.com/${apiVersion}/ads_archive?`;
    let allResponses: AdResponse[] = [];
    let fetchedAdsCount = 0;
    let cursor: string | undefined = undefined; // Initialiser cursor à undefined pour entrer dans la boucle
    do {
      let apiUrl = baseApiUrl;
      if (cursor) {
        apiUrl += `&after=${cursor}&`; // Ajouter le curseur à l'URL si présent
      }
  
      const response: AdFirstResponse = await this.fetchAdsLibrary(params, apiUrl);
      if (response && Array.isArray(response.data)) {
        const { data, paging } = response;
        allResponses = allResponses.concat(data);
        fetchedAdsCount += data.length;
  
        // Mise à jour du curseur avec la nouvelle valeur de paging.next
        cursor = paging?.cursors?.after; // Supposition que l'API utilise cursors.after pour la pagination
  
        if (fetchedAdsCount > ads_limit) {
          allResponses = allResponses.slice(0, ads_limit);
        }
      } else {
        // Gérer le cas où data n'est pas un tableau ou est undefined
        console.error('Unexpected response format:', response);
        break; // Sortir de la boucle si la réponse n'est pas au format attendu
      }
    } while (cursor && fetchedAdsCount < ads_limit); // Continuer tant qu'il y a un curseur et que la limite n'est pas atteinte
  
    console.log('Final response length is =>', allResponses.length);
    return allResponses;
  };
  async initBrowser (headless = false)   {
    // Start the browser
    const browser: Browser = await puppeteer.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_PATH,
    });
  
    const page: Page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
  
    // Définir l'agent utilisateur et les en-têtes supplémentaires
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const headers = {
      'User-Agent': userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',
  
      Referer: 'http://www.facebook.com', // Add this line to include the Referer header
    };
  
    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders(headers);
    return { browser, page };
  };
  async getHello(): Promise<void> {
    console.log("Request started")
    await sleep(600000) 

  }
  
}
