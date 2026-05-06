import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './index';
import path from 'path';

/**
 * 환경별 DB 설정
 * - development: sql.js (SQLite, 파일 기반, 설치 불필요)
 * - production: MySQL
 */
const getDataSourceOptions = (): DataSourceOptions => {
  const entities = [path.join(__dirname, '../entities/*.{ts,js}')];

  if (config.nodeEnv === 'production' || config.db.host !== 'localhost' || process.env.USE_MYSQL === 'true') {
    // MySQL (프로덕션 또는 명시적 MySQL 사용)
    return {
      type: 'mysql',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      synchronize: false,
      logging: config.nodeEnv === 'development',
      entities,
      charset: 'utf8mb4',
    };
  }

  // SQLite (개발/테스트 - 설치 불필요)
  return {
    type: 'sqljs',
    location: path.join(__dirname, '../../data/database.sqlite'),
    autoSave: true,
    synchronize: true,
    logging: false,
    entities,
  };
};

export const AppDataSource = new DataSource(getDataSourceOptions());
