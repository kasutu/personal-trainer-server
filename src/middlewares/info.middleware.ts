import { logger } from "~/utils/logger";
import type { NextFunction, Request, Response } from "express";

interface RequestInfo {
  method: string;
  path: string;
}

export const InfoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const requestInfo: RequestInfo = {
    method: req.method,
    path: req.path,
  };

  try {
    logRequestDetails(requestInfo, req);
    interceptResponse(requestInfo, res, startTime);
    next();
  } catch (error) {
    next(error);
  }
};

function logRequestDetails(info: RequestInfo, req: Request): void {
  logger.info(
    `[${info.method}] ${info.path} >> QueryParams:: ${JSON.stringify(
      req.query
    )}`
  );
  logger.info(
    `[${info.method}] ${info.path} >> Params:: ${JSON.stringify(req.params)}`
  );
  logger.info(
    `[${info.method}] ${info.path} >> Headers:: ${JSON.stringify(req.headers)}`
  );
}

function interceptResponse(
  info: RequestInfo,
  res: Response,
  startTime: number
): void {
  const oldSend = res.send;
  res.send = function () {
    const duration = Date.now() - startTime;
    logResponseDetails(info, res.statusCode, duration);
    return oldSend.apply(res, arguments as unknown as [body?: any]);
  };
}

function logResponseDetails(
  info: RequestInfo,
  statusCode: number,
  duration: number
): void {
  logger.info(`[${info.method}] ${info.path} << Status:: ${statusCode}`);
  logger.info(`[${info.method}] ${info.path} << Duration:: ${duration}ms`);
}
