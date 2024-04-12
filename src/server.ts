import { PORT } from './config';
import express from 'express';
import createExpressApp from './app';
import http from 'http';

const startServer = async () => {
  const app = express();
  await createExpressApp(app);

  const server = http.createServer(app);

  server
    .listen(PORT, () => console.log(`Starting server on port ${PORT}...`))
    .on('listening', () => console.log(`Server running`))
    .on('error', (err) => {
      console.log(`An error occured on server, ${err}\nshutting down app..`);
      process.exit();
    });
};

startServer();
