import "reflect-metadata";
import type { Request, Response, NextFunction } from "express";
import Container from "typedi";
import { PersonService } from "../services/person.service";

export class PersonController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const people = await service.getAll();
      res.json(people);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const person = await service.getById(Number(req.params.id));
      if (!person) return res.status(404).json({ error: "Not found" });
      res.json(person);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const person = await service.create(req.body);
      res.status(201).json(person);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const person = await service.update(Number(req.params.id), req.body);
      res.json(person);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const person = await service.delete(Number(req.params.id));
      res.json(person);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(PersonService);
    try {
      const results = await service.search(req.query.q as string);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
