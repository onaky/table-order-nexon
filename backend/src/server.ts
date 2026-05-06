import { app } from './app';
import { config } from './config';
import { AppDataSource } from './config/database';

const startServer = async () => {
  try {
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
