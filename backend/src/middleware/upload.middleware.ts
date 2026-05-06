import multer from 'multer';
import path from 'path';
import { config } from '../config';

/**
 * Multer 저장소 설정
 * 파일명: {timestamp}-{random8chars}.{ext}
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, '../../', config.upload.dir);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${random}${ext}`);
  },
});

/**
 * 파일 타입 필터 (이미지만 허용)
 */
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'));
  }
};

/**
 * 이미지 업로드 미들웨어
 * - 최대 5MB
 * - jpeg, png, gif, webp만 허용
 * - 단일 파일 (필드명: 'image')
 */
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
}).single('image');
