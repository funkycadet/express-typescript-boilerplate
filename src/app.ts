import express, { Application, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { authRouter, userRouter, healthRouter } from './routes';
import { logger, morganStream } from "./utils";
// import { errHandler } from "./exceptions";

export default async (app: Application): Promise<Application> => {
  // Log to console using morgan if app is in development
  // if (process.env.ENV === 'development') app.use(morgan('dev'));
  app.use(
    morgan("combined", { stream: morganStream }) // Pipe Morgan logs to Winston
  );

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
  app.all("*", (req: Request, res: Response) => {
    logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
    return res.sendStatus(404);
  });

  // app.use(errHandler);
  app.use((err: Error, req: Request, res: Response, next: Function) => {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
    res.status(500).send("Internal Server Error");
  });
  return app;
};
