import type { Person, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class PersonService {
  async getById(id: number): Promise<Person | null> {
    return prisma.person.findUnique({ where: { id } });
  }

  async getAll(): Promise<Person[]> {
    return prisma.person.findMany({ orderBy: { lastName: "asc" } });
  }

  async create(data: Prisma.PersonCreateInput): Promise<Person> {
    return prisma.person.create({ data });
  }

  async update(id: number, data: Prisma.PersonUpdateInput): Promise<Person> {
    return prisma.person.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Person> {
    return prisma.person.delete({ where: { id } });
  }

  async search(query: string): Promise<Person[]> {
    return prisma.person.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { personalEmail: { contains: query } },
        ],
      },
      orderBy: { lastName: "asc" },
    });
  }
}
