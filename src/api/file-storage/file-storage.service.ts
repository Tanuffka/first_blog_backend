/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import-x/no-unresolved */
import * as path from 'path';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { lookup } from 'mime-types';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageService {
  private readonly S3_CLIENT: S3Client;
  private readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = configService.getOrThrow<string>('S3_ENDPOINT');
    const accessKeyId = configService.getOrThrow<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = configService.getOrThrow<string>(
      'S3_SECRET_ACCESS_KEY',
    );

    console.log(endpoint, accessKeyId, secretAccessKey);

    this.S3_BUCKET_NAME = configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.S3_CLIENT = new S3Client({
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    });
  }

  /**
   * Generate a pre-signed URL for uploading an image
   */
  async getUploadUrl(fileKey: string): Promise<string> {
    const fileExt = path.extname(fileKey);
    const fileName =
      fileKey.replace(fileExt, '').toLowerCase().split(' ').join('-') +
      Date.now() +
      fileExt;
    const contentType = lookup(fileExt) || 'application/octet-stream';

    // Generate the PutObjectCommand for the file
    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    });

    // Generate and return the pre-signed URL
    return await getSignedUrl(this.S3_CLIENT, command, { expiresIn: 3600 });
  }

  /**
   * Generate a pre-signed URL for fetching an image
   */
  async getDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: fileKey,
    });

    return await getSignedUrl(this.S3_CLIENT, command);
  }

  /**
   * Generate a pre-signed URL for deleting an image
   */
  async getDeleteUrl(fileKey: string): Promise<string> {
    const command = new DeleteObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: fileKey,
    });

    return await getSignedUrl(this.S3_CLIENT, command);
  }
}
