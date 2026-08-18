import multer from 'multer';
import path from 'path';

const ALLOWED_CV_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

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

// Image upload (memory storage)
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP and GIF images are accepted'));
    }
  },
});
