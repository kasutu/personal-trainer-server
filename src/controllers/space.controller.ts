import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { SpaceService } from "~/services/space.service";
import { createResponseDto } from "~/types/dto/response.dto";

export class SpaceController {
  public async getAllSpaces(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(SpaceService);
    try {
      const result = await service.getAll();
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getSpaceById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(SpaceService);
    const { id } = req.params;
    try {
      const result = await service.getById(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createSpace(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(SpaceService);
    try {
      const result = await service.create(req.body);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateSpace(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(SpaceService);
    const { id } = req.params;
    try {
      const result = await service.update(id, req.body);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async softDeleteSpace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceService);
    const { id } = req.params;
    try {
      const result = await service.softDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async restoreSpace(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(SpaceService);
    const { id } = req.params;
    try {
      const result = await service.restore(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async hardDeleteSpace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceService);
    const { id } = req.params;
    try {
      const result = await service.hardDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
