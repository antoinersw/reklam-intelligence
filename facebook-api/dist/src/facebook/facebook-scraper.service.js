"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookScraperService = void 0;
const common_1 = require("@nestjs/common");
const FacebookInterfaces_1 = require("./models/FacebookInterfaces");
const puppeteer_1 = require("puppeteer");
const aws_service_1 = require("./aws.service");
const sleep_1 = require("../utils/sleep");
const getDate_1 = require("../utils/getDate");
const acceptAllCookies_1 = require("../utils/acceptAllCookies");
let FacebookScraperService = class FacebookScraperService {
    constructor(awsService) {
        this.awsService = awsService;
    }
    scrapFacebook(ads, brandName, best_ads_limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const { browser } = yield this.initBrowser();
            const bestAds = this.findBestAds(ads, best_ads_limit);
            const newAds = [];
            const screenshotTasks = bestAds.map((ad, index) => __awaiter(this, void 0, void 0, function* () {
                const page = yield browser.newPage();
                const callToActionUrl = yield this.getFacebookCallToActionUrl(ad.ad_snapshot_url, page);
                const { creativePath, fullAdPath } = yield this.getAdScreenshot(page, ad.ad_snapshot_url, brandName, index);
                ad.creative_src = creativePath;
                ad.full_ad_src = fullAdPath;
                if (callToActionUrl) {
                    ad.callToActionUrl = callToActionUrl;
                    const landingUrlPath = yield this.getFacebookLandingPageScreenshot(page, ad.callToActionUrl, brandName, index);
                    ad.landing_page_src = landingUrlPath;
                    yield page.close();
                    newAds.push(ad);
                }
                else {
                    ad.landing_page_src = '';
                    return;
                }
            }));
            yield Promise.all(screenshotTasks);
            yield browser.close();
            return newAds;
        });
    }
    initBrowser() {
        return __awaiter(this, arguments, void 0, function* (headless = false) {
            const browser = yield puppeteer_1.default.launch({
                headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: process.env.CHROME_PATH,
            });
            const page = yield browser.newPage();
            yield page.setViewport({
                width: 1920,
                height: 1080,
            });
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
            const headers = {
                'User-Agent': userAgent,
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                DNT: '1',
                Referer: 'http://www.facebook.com',
            };
            yield page.setUserAgent(userAgent);
            yield page.setExtraHTTPHeaders(headers);
            return { browser, page };
        });
    }
    ;
    findBestAds(ads, numberOfAds) {
        if (ads.length < numberOfAds)
            return ads;
        const bestAds = ads.reduce((acc, ad) => {
            let index;
            if (ad.eu_total_reach !== undefined) {
                index = acc.findIndex((x) => x.eu_total_reach < ad.eu_total_reach);
            }
            else {
                index = acc.findIndex((x) => x.ad_delivery_start_time > ad.ad_delivery_start_time);
            }
            if (index === -1) {
                acc.push(ad);
            }
            else {
                acc.splice(index, 0, ad);
            }
            if (acc.length > numberOfAds) {
                acc.pop();
            }
            return acc;
        }, []);
        return bestAds;
    }
    ;
    getFacebookCallToActionUrl(adSnapshotUrl, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield page.goto(adSnapshotUrl, {
                    waitUntil: 'domcontentloaded',
                });
                yield this.acceptCookiesFacebook(page);
                const landingPageUrl = yield page.$eval("a[data-lynx-mode='hover']", (el) => {
                    return el.getAttribute('href');
                });
                if (landingPageUrl && landingPageUrl != 'http://fb.me/') {
                    return this.cleanLandingPageUrl(landingPageUrl);
                }
                else {
                    console.log('No CTA found');
                    return null;
                }
            }
            catch (e) {
                console.error('ERROR =>', e);
                return null;
            }
        });
    }
    ;
    getAdScreenshot(page, url, brandName, number) {
        return __awaiter(this, void 0, void 0, function* () {
            const navigateToUrl = (page, url) => __awaiter(this, void 0, void 0, function* () {
                yield page.goto(url, { waitUntil: 'domcontentloaded' });
            });
            const getBoundingBox = (page, selector) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield page.$eval(selector, (element) => {
                        const { x, y, width, height } = element.getBoundingClientRect();
                        return { x, y, width, height };
                    });
                }
                catch (error) {
                    return null;
                }
            });
            const takeScreenshot = (page, boundingBox) => __awaiter(this, void 0, void 0, function* () {
                return yield page.screenshot({
                    clip: boundingBox,
                    encoding: 'base64',
                });
            });
            const uploadScreenshot = (subfolder, fileName, binaryData) => __awaiter(this, void 0, void 0, function* () {
                const buffer = Buffer.from(binaryData, 'base64');
                return this.awsService.uploadToS3(subfolder, fileName + '.png', buffer, 'image');
            });
            yield navigateToUrl(page, url);
            yield this.acceptCookiesFacebook(page);
            const selectors = {
                creative: 'img[alt=""]',
                video: 'video[playsinline=""]',
                fullAd: '#content > :first-child > :first-child > :first-child',
            };
            let boundingBoxCreative = yield getBoundingBox(page, selectors.creative);
            const boundingBoxFullAd = yield getBoundingBox(page, selectors.fullAd);
            if (!boundingBoxCreative) {
                boundingBoxCreative = yield getBoundingBox(page, selectors.video);
            }
            if (!boundingBoxCreative) {
                throw new Error('No image or video found with the given selectors');
            }
            const fileNameAdCreative = `ad_creative_${brandName}_${number}_${(0, getDate_1.default)()}`;
            const fileNameAdCreativeFullAd = `full_ad_${brandName}_${number}_${(0, getDate_1.default)()}`;
            const binaryAdCreative = yield takeScreenshot(page, boundingBoxCreative);
            const binaryFullAd = yield takeScreenshot(page, boundingBoxFullAd);
            const creativePath = yield uploadScreenshot(FacebookInterfaces_1.SubfolderOptions.facebook_creative, fileNameAdCreative, binaryAdCreative);
            const fullAdPath = yield uploadScreenshot(FacebookInterfaces_1.SubfolderOptions.facebook_creative, fileNameAdCreativeFullAd, binaryFullAd);
            return { creativePath, fullAdPath };
        });
    }
    ;
    getFacebookLandingPageScreenshot(page, landingPageUrl, brandName, index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield page.setViewport({
                    width: 1920,
                    height: 1080,
                });
                yield page.goto(landingPageUrl, {
                    waitUntil: 'networkidle0',
                });
                yield (0, sleep_1.default)(3000);
                yield (0, acceptAllCookies_1.default)(page);
                const fileName = `${brandName}_LANDING_PAGE_${index}_${(0, getDate_1.default)()}` + '.png';
                const binary = yield page.screenshot({
                    encoding: 'base64',
                    clip: {
                        x: 0,
                        y: 0,
                        width: 1920,
                        height: 1080,
                    },
                });
                const fileBinary = Buffer.from(binary, 'base64');
                const path = yield this.awsService.uploadToS3(FacebookInterfaces_1.SubfolderOptions.facebook_landing_page, fileName, fileBinary, 'image');
                return path;
            }
            catch (e) {
                console.error('ERROR =>', e);
                return null;
            }
        });
    }
    ;
    acceptCookiesFacebook(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, sleep_1.default)(1000);
                const acceptCookiesButton = '[data-cookiebanner="accept_button"]';
                const acceptButtonExists = (yield page.$(acceptCookiesButton)) !== null;
                if (acceptButtonExists) {
                    yield page.click(acceptCookiesButton);
                    console.log('Cookies accepted');
                    yield (0, sleep_1.default)(1000);
                }
                else {
                    console.log('No accept cookies button found');
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    ;
    cleanLandingPageUrl(dirtyURL) {
        const removeURLParameters = (urlString) => {
            const url = new URL(urlString);
            return url.origin + url.pathname;
        };
        if (dirtyURL.startsWith('https://l.facebook.com/l.php?')) {
            const params = new URLSearchParams(new URL(dirtyURL).search);
            const decodedURL = params.get('u');
            return decodedURL
                ? removeURLParameters(decodeURIComponent(decodedURL))
                : removeURLParameters(dirtyURL);
        }
        else {
            return removeURLParameters(dirtyURL);
        }
    }
    ;
};
exports.FacebookScraperService = FacebookScraperService;
exports.FacebookScraperService = FacebookScraperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_service_1.AwsService])
], FacebookScraperService);
//# sourceMappingURL=facebook-scraper.service.js.map