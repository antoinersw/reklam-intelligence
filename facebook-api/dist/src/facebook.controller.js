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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.FacebookController = void 0;
const common_1 = require("@nestjs/common");
const Facebook_ads_service_1 = require("./facebook/Facebook-ads.service");
const facebook_scraper_service_1 = require("./facebook/facebook-scraper.service");
const openai_service_1 = require("./facebook/openai.service");
const report_service_1 = require("./facebook/report.service");
let FacebookController = class FacebookController {
    constructor(facebookAdsService, facebookScraper, facebookOpenai, facebookReport) {
        this.facebookAdsService = facebookAdsService;
        this.facebookScraper = facebookScraper;
        this.facebookOpenai = facebookOpenai;
        this.facebookReport = facebookReport;
    }
    getHello() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.facebookAdsService.getHello();
            return "hello world";
        });
    }
    analyzeFacebook(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { facebookUrl, best_ads_limit, ad_reached_countries, } = body;
                console.log({ facebookUrl, best_ads_limit, ad_reached_countries, });
                const pageName = yield this.facebookAdsService.getPageNameFromPageUrl(facebookUrl);
                const pageId = yield this.facebookAdsService.getPageId(pageName);
                const { ads, brandName } = yield this.facebookAdsService.getRawAds(ad_reached_countries, pageId, best_ads_limit);
                if (ads.length === 0) {
                    return res
                        .status(common_1.HttpStatus.NO_CONTENT)
                        .json({ message: 'No ads found', success: false });
                }
                const newAds = yield this.facebookScraper.scrapFacebook(ads, brandName, best_ads_limit);
                const analysisResults = yield this.facebookOpenai.analyzeAds(newAds, brandName);
                const reportUrl = yield this.facebookReport.makeReport(brandName, analysisResults);
                res.status(common_1.HttpStatus.OK).json({
                    message: 'Report generated successfully',
                    analysisResults,
                    success: true,
                });
            }
            catch (error) {
                console.error('Error during Facebook analysis:', error);
                res
                    .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to complete analysis', success: false });
            }
        });
    }
};
exports.FacebookController = FacebookController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FacebookController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FacebookController.prototype, "analyzeFacebook", null);
exports.FacebookController = FacebookController = __decorate([
    (0, common_1.Controller)('facebook'),
    __metadata("design:paramtypes", [Facebook_ads_service_1.FacebookAdsService,
        facebook_scraper_service_1.FacebookScraperService,
        openai_service_1.OpenAIService,
        report_service_1.ReportService])
], FacebookController);
//# sourceMappingURL=facebook.controller.js.map