import { logger } from "~/utils/logger";
import type { NextFunction, Request, Response } from "express";
import type { HttpException } from "~/types/exceptions/http.exception";

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}, StackTrace:: ${error.stack}`
    );
    res.status(status).json({ message: message, stack: error.stack });
  } catch (error) {
    next(error);
  }
};
