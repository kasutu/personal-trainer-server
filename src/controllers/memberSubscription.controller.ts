import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { MemberSubscriptionService } from "../services/memberSubscription.service";

export class MemberSubscriptionController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const subs = await service.getAll();
      res.json(subs);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const sub = await service.getById(Number(req.params.id));
      if (!sub) return res.status(404).json({ error: "Not found" });
      res.json(sub);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const sub = await service.create(req.body);
      res.status(201).json(sub);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const sub = await service.update(Number(req.params.id), req.body);
      res.json(sub);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const sub = await service.delete(Number(req.params.id));
      res.json(sub);
    } catch (error) {
      next(error);
    }
  }

  async getByPerson(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const subs = await service.getByPerson(Number(req.params.personId));
      res.json(subs);
    } catch (error) {
      next(error);
    }
  }

  async getByMembership(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(MemberSubscriptionService);
    try {
      const subs = await service.getByMembership(
        Number(req.params.membershipId)
      );
      res.json(subs);
    } catch (error) {
      next(error);
    }
  }
}
