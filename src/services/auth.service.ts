import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";
import type { User, Role, UserRole } from "@prisma/client";

// DTOs for payloads
export type CreateUserPayload = {
  email: string;
  username?: string;
  hashedPassword: string;
  lastLoginAt?: Date;
};
export type UpdateUserPayload = Partial<
  Omit<CreateUserPayload, "email" | "hashedPassword">
> & {
  hashedPassword?: string;
};
export type CreateRolePayload = {
  name: string;
  description?: string;
};
export type UpdateRolePayload = Partial<CreateRolePayload>;

@Service()
export class AuthService {
  // USER CRUD
  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: CreateUserPayload): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateUser(id: number, data: UpdateUserPayload): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  // ROLE CRUD
  async getRoleById(id: number): Promise<Role | null> {
    return prisma.role.findUnique({ where: { id } });
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return prisma.role.findUnique({ where: { name } });
  }

  async createRole(data: CreateRolePayload): Promise<Role> {
    return prisma.role.create({ data });
  }

  async updateRole(id: number, data: UpdateRolePayload): Promise<Role> {
    return prisma.role.update({ where: { id }, data });
  }

  async deleteRole(id: number): Promise<Role> {
    return prisma.role.delete({ where: { id } });
  }

  // USER ROLE CRUD
  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    return prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async getUserRoles(userId: number): Promise<(UserRole & { role: Role })[]> {
    return prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  async removeUserRole(userRoleId: number): Promise<UserRole> {
    return prisma.userRole.delete({ where: { id: userRoleId } });
  }
}
