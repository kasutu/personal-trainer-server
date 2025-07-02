import type {
  MemberAccountCredentials,
  InstructorAccountCredentials,
  AdminAccountCredentials,
  Prisma,
} from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

// Types for credentials with user relations
export type MemberCredentialsWithUser =
  Prisma.MemberAccountCredentialsGetPayload<{
    include: { member: true };
  }>;

export type InstructorCredentialsWithUser =
  Prisma.InstructorAccountCredentialsGetPayload<{
    include: { instructor: true };
  }>;

export type AdminCredentialsWithUser =
  Prisma.AdminAccountCredentialsGetPayload<{
    include: { admin: true };
  }>;

// Union type for all credential types
export type AnyCredentials =
  | MemberAccountCredentials
  | InstructorAccountCredentials
  | AdminAccountCredentials;

@Service()
export class CredentialsService {
  async getMemberCredentialsById(
    id: number
  ): Promise<MemberAccountCredentials | null> {
    return prisma.memberAccountCredentials.findUnique({
      where: { id },
    });
  }

  async getMemberCredentialsByMemberId(
    id: number
  ): Promise<MemberAccountCredentials | null> {
    return prisma.memberAccountCredentials.findFirst({
      where: { id },
    });
  }

  async getMemberCredentialsByEmail(
    email: string
  ): Promise<MemberCredentialsWithUser | null> {
    return prisma.memberAccountCredentials.findUnique({
      where: { email },
      include: {
        member: true,
      },
    });
  }

  async createMemberCredentials(
    data: Prisma.MemberAccountCredentialsCreateInput
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.create({
      data,
    });
  }

  async updateMemberCredentials(
    id: number,
    data: Prisma.MemberAccountCredentialsUpdateInput
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { id },
      data,
    });
  }

  async updateMemberPassword(
    id: number,
    hashedPassword: string
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { id },
      data: { hashedPassword },
    });
  }

  async updateMemberLastLogin(id: number): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async deleteMemberCredentials(id: number): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.delete({
      where: { id },
    });
  }

  async getInstructorCredentialsById(
    id: number
  ): Promise<InstructorAccountCredentials | null> {
    return prisma.instructorAccountCredentials.findUnique({
      where: { id },
    });
  }

  async getInstructorCredentialsByInstructorId(
    instructorId: number
  ): Promise<InstructorAccountCredentials | null> {
    return prisma.instructorAccountCredentials.findUnique({
      where: { instructorId },
    });
  }

  async getInstructorCredentialsByUsername(
    username: string
  ): Promise<InstructorCredentialsWithUser | null> {
    return prisma.instructorAccountCredentials.findUnique({
      where: { username },
      include: {
        instructor: true,
      },
    });
  }

  async createInstructorCredentials(
    data: Prisma.InstructorAccountCredentialsCreateInput
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.create({
      data,
    });
  }

  async updateInstructorCredentials(
    id: number,
    data: Prisma.InstructorAccountCredentialsUpdateInput
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { id },
      data,
    });
  }

  async updateInstructorPassword(
    instructorId: number,
    hashedPassword: string
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { instructorId },
      data: { hashedPassword },
    });
  }

  async updateInstructorLastLogin(
    instructorId: number
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { instructorId },
      data: { lastLoginAt: new Date() },
    });
  }

  async deleteInstructorCredentials(
    id: number
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.delete({
      where: { id },
    });
  }

  async getAdminCredentialsById(
    id: number
  ): Promise<AdminAccountCredentials | null> {
    return prisma.adminAccountCredentials.findUnique({
      where: { id },
    });
  }

  async getAdminCredentialsByAdminId(
    adminId: number
  ): Promise<AdminAccountCredentials | null> {
    return prisma.adminAccountCredentials.findUnique({
      where: { adminId },
    });
  }

  async getAdminCredentialsByUsername(
    username: string
  ): Promise<AdminCredentialsWithUser | null> {
    return prisma.adminAccountCredentials.findUnique({
      where: { username },
      include: {
        admin: true,
      },
    });
  }

  async createAdminCredentials(
    data: Prisma.AdminAccountCredentialsCreateInput
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.create({
      data,
    });
  }

  async updateAdminCredentials(
    id: number,
    data: Prisma.AdminAccountCredentialsUpdateInput
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { id },
      data,
    });
  }

  async updateAdminPassword(
    adminId: number,
    hashedPassword: string
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { adminId },
      data: { hashedPassword },
    });
  }

  async updateAdminLastLogin(
    adminId: number
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { adminId },
      data: { lastLoginAt: new Date() },
    });
  }

  async deleteAdminCredentials(id: number): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.delete({
      where: { id },
    });
  }

  async isMemberEmailAvailable(
    email: string,
    excludeMemberId?: number
  ): Promise<boolean> {
    const existing = await prisma.memberAccountCredentials.findFirst({
      where: {
        email: { equals: email },
        ...(excludeMemberId && { memberId: { not: excludeMemberId } }),
      },
      select: { id: true },
    });
    return !existing;
  }

  async isInstructorUsernameAvailable(
    username: string,
    excludeInstructorId?: number
  ): Promise<boolean> {
    const existing = await prisma.instructorAccountCredentials.findFirst({
      where: {
        username: { equals: username },
        ...(excludeInstructorId && {
          instructorId: { not: excludeInstructorId },
        }),
      },
      select: { id: true },
    });
    return !existing;
  }

  async isAdminUsernameAvailable(
    username: string,
    excludeAdminId?: number
  ): Promise<boolean> {
    const existing = await prisma.adminAccountCredentials.findFirst({
      where: {
        username: { equals: username },
        ...(excludeAdminId && { adminId: { not: excludeAdminId } }),
      },
      select: { id: true },
    });
    return !existing;
  }

  /**
   * Check if username is available across all user types
   */
  async isUsernameGloballyAvailable(username: string): Promise<boolean> {
    const [memberExists, instructorExists, adminExists] = await Promise.all([
      this.isMemberEmailAvailable(username),
      this.isInstructorUsernameAvailable(username),
      this.isAdminUsernameAvailable(username),
    ]);

    return memberExists && instructorExists && adminExists;
  }

  /**
   * Find credentials by username across all types
   */
  async findCredentialsByUsername(username: string): Promise<{
    type: "member" | "instructor" | "admin" | null;
    credentials:
      | MemberCredentialsWithUser
      | InstructorCredentialsWithUser
      | AdminCredentialsWithUser
      | null;
  }> {
    // Check member credentials first
    const memberCreds = await this.getMemberCredentialsByEmail(username);
    if (memberCreds) {
      return { type: "member", credentials: memberCreds };
    }

    // Check instructor credentials
    const instructorCreds = await this.getInstructorCredentialsByUsername(
      username
    );
    if (instructorCreds) {
      return { type: "instructor", credentials: instructorCreds };
    }

    // Check admin credentials
    const adminCreds = await this.getAdminCredentialsByUsername(username);
    if (adminCreds) {
      return { type: "admin", credentials: adminCreds };
    }

    return { type: null, credentials: null };
  }

  /**
   * Get credentials statistics
   */
  async getCredentialsStats() {
    const [memberCount, instructorCount, adminCount] =
      await prisma.$transaction([
        prisma.memberAccountCredentials.count(),
        prisma.instructorAccountCredentials.count(),
        prisma.adminAccountCredentials.count(),
      ]);

    return {
      totalCredentials: memberCount + instructorCount + adminCount,
      byType: {
        members: memberCount,
        instructors: instructorCount,
        admins: adminCount,
      },
    };
  }

  /**
   * Get recent login activity
   */
  async getRecentLoginActivity(limit: number = 10) {
    const [memberLogins, instructorLogins, adminLogins] = await Promise.all([
      prisma.memberAccountCredentials.findMany({
        where: { lastLoginAt: { not: null } },
        include: { member: true },
        orderBy: { lastLoginAt: "desc" },
        take: limit,
      }),
      prisma.instructorAccountCredentials.findMany({
        where: { lastLoginAt: { not: null } },
        include: { instructor: true },
        orderBy: { lastLoginAt: "desc" },
        take: limit,
      }),
      prisma.adminAccountCredentials.findMany({
        where: { lastLoginAt: { not: null } },
        include: { admin: true },
        orderBy: { lastLoginAt: "desc" },
        take: limit,
      }),
    ]);

    // Combine and sort all logins
    const allLogins = [
      ...memberLogins.map((cred) => ({ ...cred, type: "member" as const })),
      ...instructorLogins.map((cred) => ({
        ...cred,
        type: "instructor" as const,
      })),
      ...adminLogins.map((cred) => ({ ...cred, type: "admin" as const })),
    ]
      .sort(
        (a, b) =>
          new Date(b.lastLoginAt!).getTime() -
          new Date(a.lastLoginAt!).getTime()
      )
      .slice(0, limit);

    return allLogins;
  }
}
