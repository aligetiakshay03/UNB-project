import { Readable } from 'stream';

export interface UploadPrivateFileParams {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder: string; // e.g. 'cv', 'private-docs'
}

export interface UploadFileResult {
  storageKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface FileStreamResult {
  stream: Readable;
  fileName: string;
  mimeType: string;
  fileSize?: number;
}

export interface StorageProvider {
  name: string;
  uploadPrivateFile(params: UploadPrivateFileParams): Promise<UploadFileResult>;
  getPrivateFileStream(storageKey: string): Promise<FileStreamResult | null>;
  getSignedUrl(storageKey: string, expiresInSeconds?: number): Promise<string | null>;
  deletePrivateFile(storageKey: string): Promise<boolean>;
}
