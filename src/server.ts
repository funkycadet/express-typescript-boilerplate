import { PORT } from './config';
import express from 'express';
import createExpressApp from './app';
import http from 'http';
import { logger } from './utils';

const startServer = async () => {
  const app = express();
  await createExpressApp(app);

  const server = http.createServer(app);

  server
    .listen(PORT, () => logger.info(`Starting server on port ${PORT}...`))
    .on('listening', () => logger.info(`Server running`))
    .on('error', (err) => {
      logger.error(`An error occured on server, ${err}\nshutting down app..`);
      process.exit();
    });
};

startServer();
