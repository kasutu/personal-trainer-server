import type { NextFunction, Request, Response } from "express";
import { logger } from "~/utils/logger";

const puns = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "Why was the server cold? It left its Windows open!",
  "Why did the server go broke? Because it lost its cache!",
  "Why do Java developers wear glasses? Because they don't C#!",
  "Why was the computer tired when it got home? Because it had a hard drive!",
  "Why was the developer always broke? Because he used up all his cache!",
  "Why did the cloud server get lost? It drifted away from its domain!",
  "Why did the database break up with the server? It couldn't handle the connection!",
];

export const NotFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404);

  const randomPun = puns[Math.floor(Math.random() * puns.length)];

  const errorResponse = {
    status: 404,
    message: `Resource not found. ${randomPun}`,
    path: req.path,
    method: req.method,
  };

  logger.warn(`[${req.method}] ${req.path} >> Resource not found`);

  res.json(errorResponse);
};
