require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
require('./models');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET environment variable is missing.');
      process.exit(1);
    }

    // Authenticate and synchronize database schema
    await sequelize.authenticate();
    console.log('[Database] PostgreSQL connection established successfully.');

    await sequelize.sync({ alter: false });
    console.log('[Database] Models synchronized.');

    const server = app.listen(PORT, () => {
      console.log(`[Server] Healthcare API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await sequelize.close();
          console.log('[Database] Connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Error] Error during database disconnect:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('[Fatal] Server failed to start:', error.message);
    process.exit(1);
  }
}

bootstrap();
