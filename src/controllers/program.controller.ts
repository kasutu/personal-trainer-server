import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { ProgramService } from "../services/program.service";

export class ProgramController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const programs = await service.getAll();
      res.json(programs);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const program = await service.getById(Number(req.params.id));
      if (!program) return res.status(404).json({ error: "Not found" });
      res.json(program);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const program = await service.create(req.body);
      res.status(201).json(program);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const program = await service.update(Number(req.params.id), req.body);
      res.json(program);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const program = await service.delete(Number(req.params.id));
      res.json(program);
    } catch (error) {
      next(error);
    }
  }

  async getByMembership(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(ProgramService);
    try {
      const programs = await service.getByMembership(
        Number(req.params.membershipId)
      );
      res.json(programs);
    } catch (error) {
      next(error);
    }
  }
}
