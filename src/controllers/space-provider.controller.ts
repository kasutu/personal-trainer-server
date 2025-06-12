import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { SpaceProvidersService } from "~/services/space-provider.service";
import { createResponseDto } from "~/types/dto/response.dto";

export class SpaceProvidersController {
  public async getAllSpaceProviders(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    try {
      const result = await service.getAll();
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getSpaceProviderById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    const { id } = req.params;
    try {
      const result = await service.getById(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createSpaceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    try {
      const result = await service.create(req.body);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateSpaceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    const { id } = req.params;
    try {
      const result = await service.update(id, req.body);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async softDeleteSpaceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    const { id } = req.params;
    try {
      const result = await service.softDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async restoreSpaceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    const { id } = req.params;
    try {
      const result = await service.restore(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async hardDeleteSpaceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceProvidersService);
    const { id } = req.params;
    try {
      const result = await service.hardDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
