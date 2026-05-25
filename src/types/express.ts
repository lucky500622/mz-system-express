import { Request, Response, NextFunction } from 'express'

export type Controller<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>

export type ErrorController<T> = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T> | void