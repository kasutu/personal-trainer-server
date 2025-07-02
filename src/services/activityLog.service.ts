import type { ActivityLog, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class ActivityLogService {
  async getById(id: number): Promise<ActivityLog | null> {
    return prisma.activityLog.findUnique({ where: { id } });
  }

  async getAll(): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany();
  }

  async create(data: Prisma.ActivityLogCreateInput): Promise<ActivityLog> {
    return prisma.activityLog.create({ data });
  }

  async update(id: number, data: Prisma.ActivityLogUpdateInput): Promise<ActivityLog> {
    return prisma.activityLog.update({ where: { id }, data });
  }

  async delete(id: number): Promise<ActivityLog> {
    return prisma.activityLog.delete({ where: { id } });
  }

  async getByPerson(personId: number): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany({ where: { personId } });
  }
}
