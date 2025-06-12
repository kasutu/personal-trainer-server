import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { BuildingService } from "~/services/building.service";
import { createResponseDto } from "~/types/dto/response.dto";

export class BuildingController {
  public async getAllBuildings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(BuildingService);
    try {
      const result = await service.getAll();
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getBuildingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(BuildingService);
    const { id } = req.params;
    try {
      const result = await service.getById(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createBuilding(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(BuildingService);
    try {
      const result = await service.create(req.body);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateBuilding(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(BuildingService);
    const { id } = req.params;
    try {
      const result = await service.update(id, req.body);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async softDeleteBuilding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(BuildingService);
    const { id } = req.params;
    try {
      const result = await service.softDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async restoreBuilding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(BuildingService);
    const { id } = req.params;
    try {
      const result = await service.restore(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async hardDeleteBuilding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(BuildingService);
    const { id } = req.params;
    try {
      const result = await service.hardDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
