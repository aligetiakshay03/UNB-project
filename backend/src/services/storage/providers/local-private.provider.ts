import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadPrivateFileParams, UploadFileResult, FileStreamResult } from '../storage.types';

export class LocalPrivateStorageProvider implements StorageProvider {
  public name = 'local-private';
  private baseDir: string;

  constructor() {
    // Private directory outside public web server roots
    this.baseDir = path.join(process.cwd(), 'storage', 'private');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public async uploadPrivateFile(params: UploadPrivateFileParams): Promise<UploadFileResult> {
    const ext = path.extname(params.fileName).toLowerCase();
    const safeBase = path
      .basename(params.fileName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFileName = `${safeBase}-${uniqueSuffix}${ext}`;

    const targetFolder = path.join(this.baseDir, params.folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = path.join(targetFolder, sanitizedFileName);
    await fs.promises.writeFile(filePath, params.buffer);

    const storageKey = `${params.folder}/${sanitizedFileName}`;

    console.log(`[STORAGE PRIVATE] Uploaded private file: ${storageKey} (${params.buffer.length} bytes)`);

    return {
      storageKey,
      fileName: params.fileName,
      fileSize: params.buffer.length,
      mimeType: params.mimeType,
    };
  }

  public async getPrivateFileStream(storageKey: string): Promise<FileStreamResult | null> {
    // Sanitize storage key to prevent directory traversal
    const safeKey = storageKey.replace(/\.\./g, '');
    const filePath = path.join(this.baseDir, safeKey);

    if (!fs.existsSync(filePath)) {
      console.warn(`[STORAGE PRIVATE] File not found for key: ${storageKey}`);
      return null;
    }

    const stat = await fs.promises.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.doc') mimeType = 'application/msword';

    const stream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    return {
      stream,
      fileName,
      fileSize: stat.size,
      mimeType,
    };
  }

  public async getSignedUrl(storageKey: string): Promise<string | null> {
    // For local private files, signed URLs are not supported directly;
    // files are streamed through authenticated API GET /api/admin/applications/:id/cv
    return null;
  }

  public async deletePrivateFile(storageKey: string): Promise<boolean> {
    const safeKey = storageKey.replace(/\.\./g, '');
    const filePath = path.join(this.baseDir, safeKey);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
