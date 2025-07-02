import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { MemberStandardPreferenceLogService } from "../services/memberStandardPreferenceLog.service";

export class MemberStandardPreferenceLogController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const logs = await service.getAll();
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const log = await service.getById(Number(req.params.id));
      if (!log) return res.status(404).json({ error: "Not found" });
      res.json(log);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const log = await service.create(req.body);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const log = await service.update(Number(req.params.id), req.body);
      res.json(log);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const log = await service.delete(Number(req.params.id));
      res.json(log);
    } catch (error) {
      next(error);
    }
  }

  async getByPerson(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberStandardPreferenceLogService);
    try {
      const logs = await service.getByPerson(Number(req.params.personId));
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }
}
