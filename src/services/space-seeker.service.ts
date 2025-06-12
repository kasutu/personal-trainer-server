import type { Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";
import type { SpaceSeeker } from "~/types/core/core.types";

@Service()
export class SpaceSeekerService {
  async getById(id: string): Promise<SpaceSeeker | null> {
    return prisma.spaceSeeker.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<SpaceSeeker[]> {
    return prisma.spaceSeeker.findMany();
  }

  async create(data: Prisma.SpaceSeekerCreateInput): Promise<SpaceSeeker> {
    return prisma.spaceSeeker.create({ data });
  }

  async update(
    id: string,
    data: Prisma.SpaceSeekerUpdateInput
  ): Promise<SpaceSeeker> {
    return prisma.spaceSeeker.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<SpaceSeeker> {
    return prisma.spaceSeeker.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async restore(id: string): Promise<SpaceSeeker> {
    return prisma.spaceSeeker.update({
      where: { id },
      data: { deleted: false },
    });
  }

  async hardDelete(id: string): Promise<SpaceSeeker> {
    return prisma.spaceSeeker.delete({
      where: { id },
    });
  }
}
