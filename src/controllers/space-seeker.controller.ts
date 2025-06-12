import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { SpaceSeekerService } from "~/services/space-seeker.service";
import { createResponseDto } from "~/types/dto/response.dto";

export class SpaceSeekerController {
  public async getAllSpaceSeekers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    try {
      const result = await service.getAll();
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getSpaceSeekerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    const { id } = req.params;
    try {
      const result = await service.getById(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createSpaceSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    try {
      const result = await service.create(req.body);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateSpaceSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    const { id } = req.params;
    try {
      const result = await service.update(id, req.body);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async softDeleteSpaceSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    const { id } = req.params;
    try {
      const result = await service.softDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async restoreSpaceSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    const { id } = req.params;
    try {
      const result = await service.restore(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async hardDeleteSpaceSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(SpaceSeekerService);
    const { id } = req.params;
    try {
      const result = await service.hardDelete(id);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
