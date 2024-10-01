import { Request, Response, NextFunction } from "express";

function catchAsync(fn: (...args: any[]) => any) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export default catchAsync;
