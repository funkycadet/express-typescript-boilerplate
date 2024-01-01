// import { prisma } from './database';
import { HOST, PORT } from './config';
import express from 'express';
import createExpressApp from './app';
import http from 'http';

const startServer = async () => {
  const app = express();
  await createExpressApp(app);

  const server = http.createServer(app);

  server
    .listen(PORT, () =>
      console.log(`Starting {host} backend on port ${PORT}...`),
    )
    .on('listening', () => console.log(`{host} backend running`))
    .on('error', (err) => {
      console.log(
        `An error occured on {host} backend, ${err}\nshutting down app..`,
      );
      process.exit();
    });
};

startServer();
