import type { Enrollment, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class EnrollmentService {
  async getById(id: number): Promise<Enrollment | null> {
    return prisma.enrollment.findUnique({ where: { id } });
  }

  async getAll(): Promise<Enrollment[]> {
    return prisma.enrollment.findMany();
  }

  async create(data: Prisma.EnrollmentCreateInput): Promise<Enrollment> {
    return prisma.enrollment.create({ data });
  }

  async update(id: number, data: Prisma.EnrollmentUpdateInput): Promise<Enrollment> {
    return prisma.enrollment.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Enrollment> {
    return prisma.enrollment.delete({ where: { id } });
  }

  async getByPerson(personId: number): Promise<Enrollment[]> {
    return prisma.enrollment.findMany({ where: { personId } });
  }

  async getByProgram(programId: number): Promise<Enrollment[]> {
    return prisma.enrollment.findMany({ where: { programId } });
  }
}
