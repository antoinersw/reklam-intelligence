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
var FacebookAdsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAdsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constants_1 = require("./constants");
const puppeteer_1 = require("puppeteer");
let FacebookAdsService = FacebookAdsService_1 = class FacebookAdsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FacebookAdsService_1.name);
    }
    getRawAds(ad_reached_countries_1, search_page_ids_1, best_ads_limit_1) {
        return __awaiter(this, arguments, void 0, function* (ad_reached_countries, search_page_ids, best_ads_limit, ads_limit = 100) {
            const USER_LONG_TOKEN = this.configService.get('USER_LONG_TOKEN');
            const adsLibraryParams = {
                ad_reached_countries,
                ad_active_status: 'ACTIVE',
                access_token: USER_LONG_TOKEN,
                search_page_ids,
                fields: constants_1.ads_fields,
            };
            let raw_ads;
            if (search_page_ids) {
                raw_ads = yield this.fetchAdsLibraryByPageId(adsLibraryParams, ads_limit);
            }
            else {
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
        });
    }
    getPageId(pageName) {
        return __awaiter(this, void 0, void 0, function* () {
            pageName = pageName.toLowerCase();
            try {
                const url = `https://facebook.com/${pageName}/about_profile_transparency`;
                const { browser, page } = yield this.initBrowser(true);
                yield page.goto(url, { waitUntil: 'networkidle2' });
                const xpath = '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div[1]/span';
                const element = yield page.$eval(`xpath/${xpath}`, (el) => el.textContent);
                this.logger.debug('Debug page id from function => ', element);
                yield browser.close();
                return [parseInt(element)];
            }
            catch (e) {
                this.logger.error('Failed to get page ID via scraping', e);
                return [0];
            }
        });
    }
    processAds(ads) {
        const data = ads.map((ad) => {
            var _a, _b, _c, _d;
            return ({
                id: ad.id,
                ad_creation_time: ad.ad_creation_time,
                ad_creative_bodies: (_a = ad.ad_creative_bodies) === null || _a === void 0 ? void 0 : _a[0],
                ad_creative_link_captions: (_b = ad.ad_creative_link_captions) === null || _b === void 0 ? void 0 : _b[0],
                ad_creative_link_titles: (_c = ad.ad_creative_link_titles) === null || _c === void 0 ? void 0 : _c[0],
                ad_delivery_start_time: ad.ad_delivery_start_time,
                ad_snapshot_url: ad.ad_snapshot_url,
                age_country_gender_reach_breakdown: ad.age_country_gender_reach_breakdown,
                beneficiary_payers: ad.beneficiary_payers,
                eu_total_reach: ad.eu_total_reach,
                age_gender_breakdowns: ad.age_gender_breakdowns,
                languages: (_d = ad.languages) === null || _d === void 0 ? void 0 : _d[0],
                page_id: ad.page_id,
                page_name: ad.page_name,
                publisher_platforms: ad.publisher_platforms,
                target_ages: ad.target_ages,
                target_gender: ad.target_gender,
                target_locations: ad.target_locations,
                creative_src: null,
                full_ad_src: null,
                callToActionUrl: null,
                landing_page_src: null,
            });
        });
        return data;
    }
    ;
    fetchAdsLibrary(params, apiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach((key) => {
                const value = params[key];
                if (Array.isArray(value) || typeof value === 'object') {
                    queryParams.append(key, JSON.stringify(value));
                }
                else if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
            const url = `${apiUrl}${queryParams}`;
            console.log('URL IS =>', url);
            try {
                const response = yield fetch(url, { method: 'GET' });
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Error fetching data: ', error);
                throw error;
            }
        });
    }
    ;
    fetchAdsLibraryByPageId(params, ads_limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const apiVersion = 'v19.0';
            const baseApiUrl = `https://graph.facebook.com/${apiVersion}/ads_archive?`;
            let allResponses = [];
            let fetchedAdsCount = 0;
            let cursor = undefined;
            do {
                let apiUrl = baseApiUrl;
                if (cursor) {
                    apiUrl += `&after=${cursor}&`;
                }
                const response = yield this.fetchAdsLibrary(params, apiUrl);
                if (response && Array.isArray(response.data)) {
                    const { data, paging } = response;
                    allResponses = allResponses.concat(data);
                    fetchedAdsCount += data.length;
                    cursor = (_a = paging === null || paging === void 0 ? void 0 : paging.cursors) === null || _a === void 0 ? void 0 : _a.after;
                    if (fetchedAdsCount > ads_limit) {
                        allResponses = allResponses.slice(0, ads_limit);
                    }
                }
                else {
                    console.error('Unexpected response format:', response);
                    break;
                }
            } while (cursor && fetchedAdsCount < ads_limit);
            console.log('Final response length is =>', allResponses.length);
            return allResponses;
        });
    }
    ;
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
};
exports.FacebookAdsService = FacebookAdsService;
exports.FacebookAdsService = FacebookAdsService = FacebookAdsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookAdsService);
//# sourceMappingURL=Facebook-ads.service.js.map