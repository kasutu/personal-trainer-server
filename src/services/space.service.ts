import type { Space, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class SpaceService {
  async getById(id: string): Promise<Space | null> {
    return prisma.space.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<Space[]> {
    return prisma.space.findMany();
  }

  async create(data: Prisma.SpaceCreateInput): Promise<Space> {
    return prisma.space.create({ data });
  }

  async update(id: string, data: Prisma.SpaceUpdateInput): Promise<Space> {
    return prisma.space.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Space> {
    return prisma.space.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async restore(id: string): Promise<Space> {
    return prisma.space.update({
      where: { id },
      data: { deleted: false },
    });
  }

  async hardDelete(id: string): Promise<Space> {
    return prisma.space.delete({ where: { id } });
  }
}
