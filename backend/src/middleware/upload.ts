import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ALLOWED_CV_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

// Uploads directory on disk for media assets
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// CV upload (memory storage — no local disk writes; file forwarded to cloud storage)
export const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CV_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_CV_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted'));
    }
  },
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

// Image upload (disk storage for serving media assets)
export const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP and GIF images are accepted'));
    }
  },
});

