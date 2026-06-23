require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./config/migrate');

async function startServer() {
  try {
    await testConnection();
    console.log('[DB] MySQL connected successfully');
    await runMigrations();
  } catch (err) {
    console.warn('[DB] MySQL not available — API will run in degraded mode');
    console.warn('[DB]', err.message);
  }

  app.listen(config.port, () => {
    console.log(`[Server] Synapse Health AI API running on port ${config.port}`);
    console.log(`[Server] Health check: http://localhost:${config.port}/api/health`);
  });
}

startServer();
