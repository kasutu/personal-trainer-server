import type { MemberSubscription, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class MemberSubscriptionService {
  async getById(id: number): Promise<MemberSubscription | null> {
    return prisma.memberSubscription.findUnique({ where: { id } });
  }

  async getAll(): Promise<MemberSubscription[]> {
    return prisma.memberSubscription.findMany();
  }

  async create(data: Prisma.MemberSubscriptionCreateInput): Promise<MemberSubscription> {
    return prisma.memberSubscription.create({ data });
  }

  async update(id: number, data: Prisma.MemberSubscriptionUpdateInput): Promise<MemberSubscription> {
    return prisma.memberSubscription.update({ where: { id }, data });
  }

  async delete(id: number): Promise<MemberSubscription> {
    return prisma.memberSubscription.delete({ where: { id } });
  }

  async getByPerson(personId: number): Promise<MemberSubscription[]> {
    return prisma.memberSubscription.findMany({ where: { personId } });
  }
}
