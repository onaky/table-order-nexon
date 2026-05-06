import { app } from './app';
import { config } from './config';
import { AppDataSource } from './config/database';
import fs from 'fs';
import path from 'path';

const startServer = async () => {
  try {
    // data 디렉토리 자동 생성 (SQLite용)
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📁 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
