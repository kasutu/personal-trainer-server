import type { ProgressLog, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class ProgressLogService {
  async getById(id: number): Promise<ProgressLog | null> {
    return prisma.progressLog.findUnique({ where: { id } });
  }

  async getAll(): Promise<ProgressLog[]> {
    return prisma.progressLog.findMany();
  }

  async create(data: Prisma.ProgressLogCreateInput): Promise<ProgressLog> {
    return prisma.progressLog.create({ data });
  }

  async update(id: number, data: Prisma.ProgressLogUpdateInput): Promise<ProgressLog> {
    return prisma.progressLog.update({ where: { id }, data });
  }

  async delete(id: number): Promise<ProgressLog> {
    return prisma.progressLog.delete({ where: { id } });
  }

  async getByPerson(personId: number): Promise<ProgressLog[]> {
    return prisma.progressLog.findMany({ where: { personId } });
  }

  async getByEnrollment(enrollmentId: number): Promise<ProgressLog[]> {
    return prisma.progressLog.findMany({ where: { enrollmentId } });
  }
}
