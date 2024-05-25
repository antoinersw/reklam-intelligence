import { Injectable } from '@nestjs/common';
import { SubfolderOptions, TransformedAd } from './models/FacebookInterfaces';

import puppeteer, { BoundingBox, Browser, Page } from 'puppeteer';
import { AwsService } from './aws.service';
import sleep from 'src/utils/sleep';
import { AdScreenshot } from './models/ScraperInterfaces';
import getDateTime from 'src/utils/getDate';
import findCookieAcceptButton from 'src/utils/acceptAllCookies';

@Injectable()
export class FacebookScraperService {
  constructor(private awsService: AwsService) {}
  async scrapFacebook(
    ads: TransformedAd[],
    brandName: string,
    best_ads_limit: number,
  ) {
    const { browser } = await this.initBrowser();
    const bestAds = this.findBestAds(ads, best_ads_limit);
    const newAds: TransformedAd[] = [];

    const screenshotTasks = bestAds.map(async (ad, index) => {
      const page = await browser.newPage();
      const callToActionUrl = await this.getFacebookCallToActionUrl(
        ad.ad_snapshot_url as string,
        page,
      );
      const { creativePath, fullAdPath }: AdScreenshot =
        await this.getAdScreenshot(
          page,
          ad.ad_snapshot_url as string,
          brandName,
          index,
        );

      ad.creative_src = creativePath;
      ad.full_ad_src = fullAdPath;

      if (callToActionUrl) {
        ad.callToActionUrl = callToActionUrl as string;

        const landingUrlPath = await this.getFacebookLandingPageScreenshot(
          page,
          ad.callToActionUrl,
          brandName as string,
          index,
        );
        ad.landing_page_src = landingUrlPath as string;
        await page.close();
        newAds.push(ad);
      } else {
        ad.landing_page_src = '';
        return;
      }
    });

    await Promise.all(screenshotTasks);
    await browser.close();

    return newAds;
  }
  async initBrowser(headless = false) {
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
      'Accept-Language': 'fr-FR,fr;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',

      Referer: 'http://www.facebook.com', // Add this line to include the Referer header
    };

    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders(headers);
    return { browser, page };
  }
  findBestAds(ads: TransformedAd[], numberOfAds: number): TransformedAd[] {
    if (ads.length < numberOfAds) return ads;

    const bestAds = ads.reduce((acc: TransformedAd[], ad) => {
      let index;

      // Check if eu_total_reach is defined, and sort based on that
      if (ad.eu_total_reach !== undefined) {
        index = acc.findIndex(
          (x: TransformedAd) => x.eu_total_reach < ad.eu_total_reach,
        );
      } else {
        // If eu_total_reach is undefined, sort based on ad_delivery_start_time (oldest first)
        index = acc.findIndex(
          (x: TransformedAd) =>
            x.ad_delivery_start_time > ad.ad_delivery_start_time,
        );
      }

      if (index === -1) {
        acc.push(ad);
      } else {
        acc.splice(index, 0, ad);
      }

      // Keep only the desired number of ads in the accumulator
      if (acc.length > numberOfAds) {
        acc.pop();
      }

      return acc;
    }, []);

    return bestAds;
  }
  async getFacebookCallToActionUrl(
    adSnapshotUrl: string,
    page: Page,
  ): Promise<string | null> {
    try {
      // Navigate to the desired URL
      await page.goto(adSnapshotUrl, {
        waitUntil: 'domcontentloaded',
      });

      // Accept cookies if required
      await this.acceptCookiesFacebook(page);

      const landingPageUrl = await page.$eval(
        "a[data-lynx-mode='hover']",
        (el) => {
          return el.getAttribute('href');
        },
      );

      if (landingPageUrl && landingPageUrl != 'http://fb.me/') {
        return this.cleanLandingPageUrl(landingPageUrl);
      } else {
        console.log('No CTA found');
        return null;
      }
    } catch (e: any) {
      console.error('ERROR =>', e);
      return null;
    }
  }
  async getAdScreenshot(
    page: Page,
    url: string,
    brandName: string,
    number: number,
  ): Promise<AdScreenshot> {
    // Modular functions for cleaner code
    const navigateToUrl = async (page: Page, url: string) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    };

    const getBoundingBox = async (
      page: Page,
      selector: string,
    ): Promise<BoundingBox | null> => {
      try {
        return await page.$eval(selector, (element) => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        });
      } catch (error) {
        return null; // Return null if element is not found
      }
    };

    const takeScreenshot = async (page: Page, boundingBox: BoundingBox) => {
      return await page.screenshot({
        clip: boundingBox,
        encoding: 'base64',
      });
    };

    const uploadScreenshot = async (
      subfolder: SubfolderOptions,
      fileName: string,
      binaryData: any,
    ) => {
      const buffer = Buffer.from(binaryData, 'base64');
      return this.awsService.uploadToS3(
        subfolder,
        fileName + '.png',
        buffer,
        'image',
      );
    };
    await navigateToUrl(page, url);
    await this.acceptCookiesFacebook(page);

    const selectors = {
      creative: 'img[alt=""]',
      video: 'video[playsinline=""]',
      fullAd: '#content > :first-child > :first-child > :first-child',
    };

    let boundingBoxCreative = await getBoundingBox(page, selectors.creative);
    const boundingBoxFullAd = await getBoundingBox(page, selectors.fullAd);

    if (!boundingBoxCreative) {
      boundingBoxCreative = await getBoundingBox(page, selectors.video);
    }

    if (!boundingBoxCreative) {
      throw new Error('No image or video found with the given selectors');
    }

    const fileNameAdCreative = `ad_creative_${brandName}_${number}_${getDateTime()}`;
    const fileNameAdCreativeFullAd = `full_ad_${brandName}_${number}_${getDateTime()}`;

    const binaryAdCreative = await takeScreenshot(page, boundingBoxCreative);
    const binaryFullAd = await takeScreenshot(
      page,
      boundingBoxFullAd as BoundingBox,
    );

    const creativePath = await uploadScreenshot(
      SubfolderOptions.facebook_creative,
      fileNameAdCreative,
      binaryAdCreative,
    );
    const fullAdPath = await uploadScreenshot(
      SubfolderOptions.facebook_creative,
      fileNameAdCreativeFullAd,
      binaryFullAd,
    );

    return { creativePath, fullAdPath };
  }
  async getFacebookLandingPageScreenshot(
    page: Page,
    landingPageUrl: string,
    brandName: string,
    index: number,
  ): Promise<string | null> {
    try {
      // Ensure the viewport is set for this operation if not already set elsewhere
      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      // Navigate to the desired URL
      await page.goto(landingPageUrl, {
        waitUntil: 'networkidle0',
      });

      // await acceptCookiesFacebook(page); // Accept cookies if necessary

      await sleep(3000); // Wait for potential dynamic content or redirects to complete
      await findCookieAcceptButton(page);
      const fileName =
        `${brandName}_LANDING_PAGE_${index}_${getDateTime()}` + '.png';
      // Take a full-page screenshot and save to a specific path
      const binary = await page.screenshot({
        encoding: 'base64',
        clip: {
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
        },
      });
      const fileBinary = Buffer.from(binary, 'base64');
      const path = await this.awsService.uploadToS3(
        SubfolderOptions.facebook_landing_page,
        fileName,
        fileBinary,
        'image',
      );

      return path; // Successfully taken screenshot
    } catch (e) {
      console.error('ERROR =>', e);
      // Return false to indicate failure, but do not close the browser here to allow for cleanup or further attempts
      return null;
    }
  }
  async acceptCookiesFacebook(page: Page): Promise<boolean> {
    try {
      await sleep(1000);
      // await page.waitForSelector('[data-cookiebanner="accept_button"]',{timeout:2000} );
      // Sélectionner le bouton d'acceptation des cookies par l'attribut data-cookiebanner
      const acceptCookiesButton = '[data-cookiebanner="accept_button"]';

      // Vérifier si le bouton d'acceptation des cookies existe sur la page
      const acceptButtonExists = (await page.$(acceptCookiesButton)) !== null;

      if (acceptButtonExists) {
        // Cliquer sur le bouton si trouvé
        await page.click(acceptCookiesButton);
        console.log('Cookies accepted');
        await sleep(2000);
      } else {
        console.log('No accept cookies button found');
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  cleanLandingPageUrl(dirtyURL: string): string {
    const removeURLParameters = (urlString: string) => {
      const url = new URL(urlString);
      // Create a new URL without the search parameters
      return url.origin + url.pathname;
    };

    // Check if the dirtyURL starts with the specified pattern
    if (dirtyURL.startsWith('https://l.facebook.com/l.php?')) {
      // Attempt to extract the actual URL from the parameters
      const params = new URLSearchParams(new URL(dirtyURL).search);
      const decodedURL = params.get('u');

      // If a URL is successfully extracted, return it; otherwise, return the original dirtyURL
      return decodedURL
        ? removeURLParameters(decodeURIComponent(decodedURL))
        : removeURLParameters(dirtyURL);
    } else {
      // If the dirtyURL does not match the pattern, return it unchanged

      return removeURLParameters(dirtyURL);
    }
  }
}
