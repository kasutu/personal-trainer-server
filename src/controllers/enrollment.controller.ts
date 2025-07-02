import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { EnrollmentService } from "../services/enrollment.service";

export class EnrollmentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollments = await service.getAll();
      res.json(enrollments);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollment = await service.getById(Number(req.params.id));
      if (!enrollment) return res.status(404).json({ error: "Not found" });
      res.json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollment = await service.create(req.body);
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollment = await service.update(Number(req.params.id), req.body);
      res.json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollment = await service.delete(Number(req.params.id));
      res.json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  async getByPerson(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollments = await service.getByPerson(
        Number(req.params.personId)
      );
      res.json(enrollments);
    } catch (error) {
      next(error);
    }
  }

  async getByProgram(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(EnrollmentService);
    try {
      const enrollments = await service.getByProgram(
        Number(req.params.programId)
      );
      res.json(enrollments);
    } catch (error) {
      next(error);
    }
  }
}
