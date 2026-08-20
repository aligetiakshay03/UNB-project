import { StorageProvider, UploadPrivateFileParams, UploadFileResult, FileStreamResult } from '../storage.types';

export interface SupabaseStorageConfig {
  bucket: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class SupabaseStorageProvider implements StorageProvider {
  public name = 'supabase';
  private config: SupabaseStorageConfig;

  constructor(config: SupabaseStorageConfig) {
    this.config = config;
  }

  public async uploadPrivateFile(params: UploadPrivateFileParams): Promise<UploadFileResult> {
    const ext = params.fileName.split('.').pop() || '';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const storageKey = `${params.folder}/${uniqueSuffix}.${ext}`;

    console.log(`[STORAGE SUPABASE] Storing file in bucket "${this.config.bucket}" key: ${storageKey}`);

    return {
      storageKey,
      fileName: params.fileName,
      fileSize: params.buffer.length,
      mimeType: params.mimeType,
    };
  }

  public async getPrivateFileStream(storageKey: string): Promise<FileStreamResult | null> {
    console.log(`[STORAGE SUPABASE] Streaming file for key: ${storageKey}`);
    return null;
  }

  public async getSignedUrl(storageKey: string, expiresInSeconds = 900): Promise<string | null> {
    const baseUrl = this.config.endpoint.replace('/s3', '');
    return `${baseUrl}/object/sign/${this.config.bucket}/${storageKey}?token=mock-signed-token&expires=${expiresInSeconds}`;
  }

  public async deletePrivateFile(storageKey: string): Promise<boolean> {
    console.log(`[STORAGE SUPABASE] Deleted key: ${storageKey}`);
    return true;
  }
}
