import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { NotFoundMiddleware } from "~/middlewares/404.middleware";
import { ErrorMiddleware } from "~/middlewares/error.middleware";
import { InfoMiddleware } from "~/middlewares/info.middleware";
import type { Routes } from "~/types/infrastructure/routes.types";
import { logger, stream } from "~/utils/logger";
import { SilidSocket } from "~/utils/silid-socket";

export class App {
  public app: express.Application;
  public io: Server;
  public environment: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.io = new Server(createServer(this.app));
    this.environment = process.env.NODE_ENV ?? "development";
    this.port = process.env.PORT ?? 3000;
    this.initializeSockets();
    this.initializeMiddlewares();
    this.initializeInfoHandling();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(
        `🚀 App listening on the port ${this.port} (${this.environment})`
      );
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan("combined", { stream }));
    this.app.use(helmet());
    this.app.use(cors({ origin: "*" }));
    logger.info("cors enabled for all origins");
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    logger.info("Available routes:");
    routes.forEach((route) => {
      this.app.use("/api", route.router);
      this.logDeepRoutes(route);
    });
  }

  private initializeSockets() {
    SilidSocket.io = this.io;
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
    this.app.use(NotFoundMiddleware);
  }

  private initializeInfoHandling() {
    this.app.use(InfoMiddleware);
  }

  private logDeepRoutes(route: Routes): void {
    if (!route.router || !Array.isArray(route.router.stack)) return;

    route.router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        this.logRoute(middleware.route);
      } else if (
        middleware.name === "router" &&
        Array.isArray(middleware.handle.stack)
      ) {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            this.logRoute(handler.route);
          }
        });
      }
    });
  }

  private logRoute(route: any): void {
    const methods = Object.keys(route.methods)
      .map((m) => m.toUpperCase())
      .join(", ");
    logger.info(`--> [${methods}] /api${route.path}`);
  }
}
