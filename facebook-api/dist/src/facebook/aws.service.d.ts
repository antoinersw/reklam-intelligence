/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { SubfolderOptions } from './models/awsInterface';
export declare class AwsService {
    private configService;
    private s3;
    constructor(configService: ConfigService);
    uploadToS3(subfolder: SubfolderOptions, fileName: string, fileBinary: Buffer, contentType: string): Promise<string>;
}
