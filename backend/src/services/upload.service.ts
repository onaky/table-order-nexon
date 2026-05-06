import fs from 'fs';
import path from 'path';
import { config } from '../config';

/**
 * 파일 업로드/삭제 서비스
 */
export class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../', config.upload.dir);
    this.ensureUploadDir();
  }

  /**
   * 업로드 디렉토리 존재 확인 및 생성
   */
  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 이미지 파일 저장 (Multer가 이미 저장한 파일의 URL 반환)
   */
  saveImage(file: Express.Multer.File): string {
    // Multer가 이미 파일을 저장했으므로 URL만 반환
    return `/uploads/${file.filename}`;
  }

  /**
   * 이미지 파일 삭제
   * - 파일이 존재하지 않아도 에러 발생하지 않음 (graceful)
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // /uploads/filename.jpg → filename.jpg
      const filename = imageUrl.replace('/uploads/', '');
      const filePath = path.join(this.uploadDir, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // 파일 삭제 실패해도 무시 (graceful)
    }
  }

  /**
   * 이미지 접근 경로 반환
   */
  getImagePath(filename: string): string {
    return `/uploads/${filename}`;
  }
}
