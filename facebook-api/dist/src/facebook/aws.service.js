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
exports.AwsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
let AwsService = class AwsService {
    constructor(configService) {
        this.configService = configService;
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get('AWS_REGION');
        AWS.config.update({
            accessKeyId,
            secretAccessKey,
            region,
        });
        this.s3 = new AWS.S3();
    }
    uploadToS3(subfolder, fileName, fileBinary, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = process.env.BUCKET_S3;
            const fileKey = `${subfolder}${fileName}`;
            const cdnBaseUrl = process.env.BUCKET_BASE_URL;
            if (contentType === 'image')
                contentType = 'image/png';
            if (contentType === 'pdf')
                contentType = 'application/pdf';
            try {
                const params = {
                    Bucket: bucket,
                    Key: fileKey,
                    Body: fileBinary,
                    ContentType: contentType,
                    CacheControl: 'max-age=3600',
                };
                yield this.s3.putObject(params).promise();
                const imageUrl = `${cdnBaseUrl}${fileKey}`;
                return imageUrl;
            }
            catch (e) {
                throw new Error(`Error uploading image: ${e.message}`);
            }
        });
    }
    ;
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsService);
//# sourceMappingURL=aws.service.js.map