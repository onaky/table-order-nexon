import { DataSource } from 'typeorm';
import { config } from './index';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.nodeEnv === 'development', // 개발 환경에서만 자동 동기화
  logging: config.nodeEnv === 'development',
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  charset: 'utf8mb4',
});
