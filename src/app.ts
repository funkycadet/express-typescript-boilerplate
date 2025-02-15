import express, { Application, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { authRouter, userRouter, healthRouter } from './routes';

// import { errHandler } from "./exceptions";

export default async (app: Application): Promise<Application> => {
  // Log to console using morgan if app is in development
  if (process.env.ENV === 'development') app.use(morgan('dev'));

  // CORS
  app.use(cors({ credentials: true }));
  app.use(helmet());

  // Request body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // Cookie parser
  app.use(cookieParser());
  app.use(compression());

  // Application Routes
  // app.use("/", healthRouter); // Health check
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/health', healthRouter);
  // Catch and handle all 404 errors
  app.all('*', function (res: Response): Response {
    return res.sendStatus(404);
  });

  // app.use(errHandler);
  return app;
};
