import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { SytemService } from "~/services/system.service";

export class SystemController {
  public async getSystemStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SytemService);

    try {
      const environment = service.getEnvironment();
      const dbStatus = await service.getDbStatus();
      res.status(200).json({
        environment,
        dbStatus,
      });
    } catch (error) {
      next(error);
    }
  }
}
