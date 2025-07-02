import type { MemberStandardPreferenceLog, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class MemberStandardPreferenceLogService {
  async getById(id: number): Promise<MemberStandardPreferenceLog | null> {
    return prisma.memberStandardPreferenceLog.findUnique({ where: { id } });
  }

  async getAll(): Promise<MemberStandardPreferenceLog[]> {
    return prisma.memberStandardPreferenceLog.findMany();
  }

  async create(data: Prisma.MemberStandardPreferenceLogCreateInput): Promise<MemberStandardPreferenceLog> {
    return prisma.memberStandardPreferenceLog.create({ data });
  }

  async update(id: number, data: Prisma.MemberStandardPreferenceLogUpdateInput): Promise<MemberStandardPreferenceLog> {
    return prisma.memberStandardPreferenceLog.update({ where: { id }, data });
  }

  async delete(id: number): Promise<MemberStandardPreferenceLog> {
    return prisma.memberStandardPreferenceLog.delete({ where: { id } });
  }

  async getByPerson(personId: number): Promise<MemberStandardPreferenceLog[]> {
    return prisma.memberStandardPreferenceLog.findMany({ where: { personId } });
  }
}
