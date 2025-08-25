import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";

import { appConfig } from "../config/app.config";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: appConfig.S3_ENDPOINT,
      region: appConfig.S3_REGION,
      credentials: {
        accessKeyId: appConfig.S3_ACCESS_KEY,
        secretAccessKey: appConfig.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });

    this.bucketName = appConfig.S3_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      });

      await this.s3Client.send(command);

      const fileUrl = `${appConfig.S3_ENDPOINT}/${this.bucketName}/${key}`;

      this.logger.log(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  async getFileUrl(key: string): Promise<string> {
    return `${appConfig.S3_ENDPOINT}/${this.bucketName}/${key}`;
  }

  generateFileKey(originalName: string, projectId: number): string {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `project-${projectId}/${timestamp}-${sanitizedName}`;
  }
}
