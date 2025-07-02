import type { Program, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class ProgramService {
  async getById(id: number): Promise<Program | null> {
    return prisma.program.findUnique({ where: { id } });
  }

  async getAll(): Promise<Program[]> {
    return prisma.program.findMany();
  }

  async create(data: Prisma.ProgramCreateInput): Promise<Program> {
    return prisma.program.create({ data });
  }

  async update(id: number, data: Prisma.ProgramUpdateInput): Promise<Program> {
    return prisma.program.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Program> {
    return prisma.program.delete({ where: { id } });
  }

  async getByMembership(membershipId: number): Promise<Program[]> {
    return prisma.program.findMany({ where: { membershipId } });
  }
}
