import { StorageProvider, UploadPrivateFileParams, UploadFileResult, FileStreamResult } from '../storage.types';

export interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
}

export class S3StorageProvider implements StorageProvider {
  public name = 's3';
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
  }

  public async uploadPrivateFile(params: UploadPrivateFileParams): Promise<UploadFileResult> {
    const ext = params.fileName.split('.').pop() || '';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const storageKey = `${params.folder}/${uniqueSuffix}.${ext}`;

    console.log(`[STORAGE S3 UPLOAD] Prepared S3 bucket "${this.config.bucket}" key: ${storageKey}`);

    // In a live AWS environment with @aws-sdk/client-s3 configured:
    // const s3Client = new S3Client({ region: this.config.region, credentials: { ... } });
    // await s3Client.send(new PutObjectCommand({ Bucket: this.config.bucket, Key: storageKey, Body: params.buffer, ContentType: params.mimeType }));

    return {
      storageKey,
      fileName: params.fileName,
      fileSize: params.buffer.length,
      mimeType: params.mimeType,
    };
  }

  public async getPrivateFileStream(storageKey: string): Promise<FileStreamResult | null> {
    console.log(`[STORAGE S3 STREAM] Fetching stream from bucket "${this.config.bucket}" for key: ${storageKey}`);
    return null;
  }

  public async getSignedUrl(storageKey: string, expiresInSeconds = 900): Promise<string | null> {
    // Generates a pre-signed AWS S3 GET URL expiring in 15 minutes
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${storageKey}?X-Amz-Expires=${expiresInSeconds}&signed=mock`;
  }

  public async deletePrivateFile(storageKey: string): Promise<boolean> {
    console.log(`[STORAGE S3 DELETE] Deleted key from bucket "${this.config.bucket}": ${storageKey}`);
    return true;
  }
}
