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
  /**
   * Get member credentials by ID
   */
  async getMemberCredentialsById(
    id: number
  ): Promise<MemberAccountCredentials | null> {
    return prisma.memberAccountCredentials.findUnique({
      where: { id },
    });
  }

  /**
   * Get member credentials by member ID
   */
  async getMemberCredentialsByMemberId(
    memberId: number
  ): Promise<MemberAccountCredentials | null> {
    return prisma.memberAccountCredentials.findUnique({
      where: { memberId },
    });
  }

  /**
   * Get member credentials by username
   */
  async getMemberCredentialsByUsername(
    username: string
  ): Promise<MemberCredentialsWithUser | null> {
    return prisma.memberAccountCredentials.findUnique({
      where: { username },
      include: {
        member: true,
      },
    });
  }

  /**
   * Create member credentials
   */
  async createMemberCredentials(
    data: Prisma.MemberAccountCredentialsCreateInput
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.create({
      data,
    });
  }

  /**
   * Update member credentials
   */
  async updateMemberCredentials(
    id: number,
    data: Prisma.MemberAccountCredentialsUpdateInput
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { id },
      data,
    });
  }

  /**
   * Update member password
   */
  async updateMemberPassword(
    memberId: number,
    hashedPassword: string
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { memberId },
      data: { hashedPassword },
    });
  }

  /**
   * Update member last login
   */
  async updateMemberLastLogin(
    memberId: number
  ): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.update({
      where: { memberId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Delete member credentials
   */
  async deleteMemberCredentials(id: number): Promise<MemberAccountCredentials> {
    return prisma.memberAccountCredentials.delete({
      where: { id },
    });
  }

  /**
   * Get instructor credentials by ID
   */
  async getInstructorCredentialsById(
    id: number
  ): Promise<InstructorAccountCredentials | null> {
    return prisma.instructorAccountCredentials.findUnique({
      where: { id },
    });
  }

  /**
   * Get instructor credentials by instructor ID
   */
  async getInstructorCredentialsByInstructorId(
    instructorId: number
  ): Promise<InstructorAccountCredentials | null> {
    return prisma.instructorAccountCredentials.findUnique({
      where: { instructorId },
    });
  }

  /**
   * Get instructor credentials by username
   */
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

  /**
   * Create instructor credentials
   */
  async createInstructorCredentials(
    data: Prisma.InstructorAccountCredentialsCreateInput
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.create({
      data,
    });
  }

  /**
   * Update instructor credentials
   */
  async updateInstructorCredentials(
    id: number,
    data: Prisma.InstructorAccountCredentialsUpdateInput
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { id },
      data,
    });
  }

  /**
   * Update instructor password
   */
  async updateInstructorPassword(
    instructorId: number,
    hashedPassword: string
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { instructorId },
      data: { hashedPassword },
    });
  }

  /**
   * Update instructor last login
   */
  async updateInstructorLastLogin(
    instructorId: number
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.update({
      where: { instructorId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Delete instructor credentials
   */
  async deleteInstructorCredentials(
    id: number
  ): Promise<InstructorAccountCredentials> {
    return prisma.instructorAccountCredentials.delete({
      where: { id },
    });
  }

  /**
   * Get admin credentials by ID
   */
  async getAdminCredentialsById(
    id: number
  ): Promise<AdminAccountCredentials | null> {
    return prisma.adminAccountCredentials.findUnique({
      where: { id },
    });
  }

  /**
   * Get admin credentials by admin ID
   */
  async getAdminCredentialsByAdminId(
    adminId: number
  ): Promise<AdminAccountCredentials | null> {
    return prisma.adminAccountCredentials.findUnique({
      where: { adminId },
    });
  }

  /**
   * Get admin credentials by username
   */
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

  /**
   * Create admin credentials
   */
  async createAdminCredentials(
    data: Prisma.AdminAccountCredentialsCreateInput
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.create({
      data,
    });
  }

  /**
   * Update admin credentials
   */
  async updateAdminCredentials(
    id: number,
    data: Prisma.AdminAccountCredentialsUpdateInput
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { id },
      data,
    });
  }

  /**
   * Update admin password
   */
  async updateAdminPassword(
    adminId: number,
    hashedPassword: string
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { adminId },
      data: { hashedPassword },
    });
  }

  /**
   * Update admin last login
   */
  async updateAdminLastLogin(
    adminId: number
  ): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.update({
      where: { adminId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Delete admin credentials
   */
  async deleteAdminCredentials(id: number): Promise<AdminAccountCredentials> {
    return prisma.adminAccountCredentials.delete({
      where: { id },
    });
  }

  /**
   * Check if username is available for members
   */
  async isMemberUsernameAvailable(
    username: string,
    excludeMemberId?: number
  ): Promise<boolean> {
    const existing = await prisma.memberAccountCredentials.findFirst({
      where: {
        username: { equals: username },
        ...(excludeMemberId && { memberId: { not: excludeMemberId } }),
      },
      select: { id: true },
    });
    return !existing;
  }

  /**
   * Check if username is available for instructors
   */
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

  /**
   * Check if username is available for admins
   */
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
      this.isMemberUsernameAvailable(username),
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
    const memberCreds = await this.getMemberCredentialsByUsername(username);
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
