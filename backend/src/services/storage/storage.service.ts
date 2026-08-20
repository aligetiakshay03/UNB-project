import { StorageProvider, UploadPrivateFileParams, UploadFileResult, FileStreamResult } from './storage.types';
import { LocalPrivateStorageProvider } from './providers/local-private.provider';
import { S3StorageProvider } from './providers/s3.provider';
import { SupabaseStorageProvider } from './providers/supabase.provider';

class StorageService {
  private provider: StorageProvider;

  constructor() {
    const providerType = process.env.STORAGE_PROVIDER || 'local-private';

    if (providerType === 's3') {
      this.provider = new S3StorageProvider({
        bucket: process.env.STORAGE_BUCKET || 'unb-private-storage',
        region: process.env.STORAGE_REGION || 'af-south-1',
        accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
        secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
        endpoint: process.env.STORAGE_ENDPOINT,
      });
    } else if (providerType === 'supabase') {
      this.provider = new SupabaseStorageProvider({
        bucket: process.env.STORAGE_BUCKET || 'unb-private-storage',
        endpoint: process.env.STORAGE_ENDPOINT || '',
        accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
        secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
      });
    } else {
      this.provider = new LocalPrivateStorageProvider();
    }
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async uploadPrivateFile(params: UploadPrivateFileParams): Promise<UploadFileResult> {
    return this.provider.uploadPrivateFile(params);
  }

  public async getPrivateFileStream(storageKey: string): Promise<FileStreamResult | null> {
    return this.provider.getPrivateFileStream(storageKey);
  }

  public async getSignedUrl(storageKey: string, expiresInSeconds?: number): Promise<string | null> {
    return this.provider.getSignedUrl(storageKey, expiresInSeconds);
  }

  public async deletePrivateFile(storageKey: string): Promise<boolean> {
    return this.provider.deletePrivateFile(storageKey);
  }
}

export const storageService = new StorageService();
