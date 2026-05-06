import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../config/database';
import { config } from '../config';
import { Admin, Table, TableSession } from '../entities';
import { AdminTokenPayload, TableTokenPayload, TokenPayload, TokenType } from '../types';

const SALT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export class AuthService {
  private adminRepo = AppDataSource.getRepository(Admin);
  private tableRepo = AppDataSource.getRepository(Table);
  private sessionRepo = AppDataSource.getRepository(TableSession);

  /**
   * 테이블 인증
   * - 매장+테이블번호+비밀번호 검증
   * - 기존 활성 세션 재사용 또는 새 세션 생성
   * - JWT 토큰 발급
   */
  async authenticateTable(
    storeId: string,
    tableNo: number,
    password: string
  ): Promise<{ token: string; table: { id: number; storeId: string; tableNo: number }; session: { sessionId: string; startedAt: Date } }> {
    // 테이블 조회
    const table = await this.tableRepo.findOne({
      where: { storeId, tableNo },
    });

    if (!table) {
      throw Object.assign(new Error('테이블을 찾을 수 없습니다'), { statusCode: 404 });
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, table.password);
    if (!isValid) {
      throw Object.assign(new Error('비밀번호가 일치하지 않습니다'), { statusCode: 401 });
    }

    // 기존 활성 세션 확인 또는 새 세션 생성
    let session = await this.sessionRepo.findOne({
      where: { tableId: table.id, isActive: true },
    });

    if (!session) {
      session = this.sessionRepo.create({
        sessionId: uuidv4(),
        tableId: table.id,
        storeId,
        isActive: true,
      });
      await this.sessionRepo.save(session);
    }

    // JWT 발급
    const payload: TableTokenPayload = {
      type: TokenType.TABLE,
      storeId,
      tableId: table.id,
      tableNo: table.tableNo,
      sessionId: session.sessionId,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.tableExpiresIn,
    });

    return {
      token,
      table: { id: table.id, storeId: table.storeId, tableNo: table.tableNo },
      session: { sessionId: session.sessionId, startedAt: session.startedAt },
    };
  }

  /**
   * 관리자 인증
   * - 매장+사용자명+비밀번호 검증
   * - 로그인 시도 제한 (5회 실패 → 15분 잠금)
   * - JWT 토큰 발급
   */
  async authenticateAdmin(
    storeId: string,
    username: string,
    password: string
  ): Promise<{ token: string; admin: { id: number; storeId: string; username: string } }> {
    // 관리자 조회
    const admin = await this.adminRepo.findOne({
      where: { storeId, username },
    });

    if (!admin) {
      throw Object.assign(new Error('인증 정보가 올바르지 않습니다'), { statusCode: 401 });
    }

    // 계정 잠금 확인
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / (1000 * 60)
      );
      throw Object.assign(
        new Error(`계정이 잠겨있습니다. ${remainingMinutes}분 후 재시도해주세요`),
        { statusCode: 429 }
      );
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      // 실패 횟수 증가
      admin.failedLoginAttempts += 1;

      if (admin.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      }

      await this.adminRepo.save(admin);
      throw Object.assign(new Error('인증 정보가 올바르지 않습니다'), { statusCode: 401 });
    }

    // 로그인 성공 → 실패 횟수 초기화
    admin.failedLoginAttempts = 0;
    admin.lockedUntil = null;
    await this.adminRepo.save(admin);

    // JWT 발급
    const payload: AdminTokenPayload = {
      type: TokenType.ADMIN,
      storeId,
      adminId: admin.id,
      username: admin.username,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.adminExpiresIn,
    });

    return {
      token,
      admin: { id: admin.id, storeId: admin.storeId, username: admin.username },
    };
  }

  /**
   * JWT 토큰 검증
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw Object.assign(new Error('토큰이 만료되었습니다'), { statusCode: 401 });
      }
      throw Object.assign(new Error('유효하지 않은 토큰입니다'), { statusCode: 401 });
    }
  }

  /**
   * 비밀번호 해싱
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * 비밀번호 비교
   */
  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
