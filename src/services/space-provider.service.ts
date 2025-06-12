import type { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";
import type { SpaceProvider } from "~/types/core/core.types";

@Service()
export class SpaceProvidersService {
  async getById(id: string): Promise<SpaceProvider | null> {
    return prisma.spaceProvider.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<SpaceProvider[]> {
    return prisma.spaceProvider.findMany();
  }

  async create(data: Prisma.SpaceProviderCreateInput): Promise<SpaceProvider> {
    return prisma.spaceProvider.create({ data });
  }

  async update(
    id: string,
    data: Prisma.SpaceProviderUpdateInput
  ): Promise<SpaceProvider> {
    return prisma.spaceProvider.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<SpaceProvider> {
    return prisma.spaceProvider.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async restore(id: string): Promise<SpaceProvider> {
    return prisma.spaceProvider.update({
      where: { id },
      data: { deleted: false },
    });
  }

  async hardDelete(id: string): Promise<SpaceProvider> {
    return prisma.spaceProvider.delete({
      where: { id },
    });
  }
}
