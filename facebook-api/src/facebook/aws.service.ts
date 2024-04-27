import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
 import * as AWS from 'aws-sdk'
import { SubfolderOptions } from './models/awsInterface';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
@Injectable()
export class AwsService {
    private s3;

    constructor(private configService: ConfigService) {
      const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
      const region = this.configService.get<string>('AWS_REGION');

      AWS.config.update({
        accessKeyId,
        secretAccessKey,
        region,
      });

      this.s3 = new AWS.S3();
    }

   async  uploadToS3 (
      subfolder: SubfolderOptions,
      fileName: string,
      fileBinary: Buffer,
      contentType: string,
    ): Promise<string>  {
      const bucket = process.env.BUCKET_S3;
      const fileKey = `${subfolder}${fileName}`; // Example file key
      const cdnBaseUrl = process.env.BUCKET_BASE_URL;
      if (contentType === 'image') contentType = 'image/png';
      if (contentType === 'pdf') contentType = 'application/pdf';
      try {
        // Define the parameters for putObject
        const params: PutObjectRequest = {
          Bucket: bucket as string,
          Key: fileKey,
          Body: fileBinary, // Here you should actually provide the binary data of the image,
          ContentType: contentType,
          CacheControl: 'max-age=3600',
        };
    
        // Upload the image to S3
        await this.s3.putObject(params).promise();
        const imageUrl = `${cdnBaseUrl}${fileKey}`;
    
        return imageUrl;
      } catch (e: any) {
        // If an error occurs during the upload process, throw an error with the original error message
        throw new Error(`Error uploading image: ${e.message}`);
      }
    };
}
