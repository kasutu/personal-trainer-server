import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { MembershipService } from "../services/membership.service";

export class MembershipController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MembershipService);
    try {
      const memberships = await service.getAll();
      res.json(memberships);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MembershipService);
    try {
      const membership = await service.getById(Number(req.params.id));
      if (!membership) return res.status(404).json({ error: "Not found" });
      res.json(membership);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MembershipService);
    try {
      const membership = await service.create(req.body);
      res.status(201).json(membership);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MembershipService);
    try {
      const membership = await service.update(Number(req.params.id), req.body);
      res.json(membership);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MembershipService);
    try {
      const membership = await service.delete(Number(req.params.id));
      res.json(membership);
    } catch (error) {
      next(error);
    }
  }
}
