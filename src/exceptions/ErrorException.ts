import { Request, Response, NextFunction } from 'express';

const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name && err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
  }

  if (err.isAxiosError) {
    if (err.code === 'ECONNREFUSED') {
      err.statusCode = 503;
      err.message = `${
        err.request._options.path.split('/')[1]
      } service unavailable.`;
    }
    if (err.response) {
      err.statusCode = err.response.status;
      err.message = err.response.data.message;
    }
  }

  console.log(err);
  return res
    .status(err.statusCode || 500)
    .json({ status: 'failed', message: err.message });
};

export default errHandler;
