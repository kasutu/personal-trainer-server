import type { Building, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class BuildingService {
  async getById(id: string): Promise<Building | null> {
    return prisma.building.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<Building[]> {
    return prisma.building.findMany();
  }

  async create(data: Prisma.BuildingCreateInput): Promise<Building> {
    return prisma.building.create({ data });
  }

  async update(
    id: string,
    data: Prisma.BuildingUpdateInput
  ): Promise<Building> {
    return prisma.building.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Building> {
    return prisma.building.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async restore(id: string): Promise<Building> {
    return prisma.building.update({
      where: { id },
      data: { deleted: false },
    });
  }

  async hardDelete(id: string): Promise<Building> {
    return prisma.building.delete({ where: { id } });
  }
}
