import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { AuthService } from "../services/auth.service";
import type {
  CreateUserPayload,
  CreateRolePayload,
  UpdateUserPayload,
  UpdateRolePayload,
} from "../services/auth.service";
import { prisma } from "../drivers/prisma";

let authService: AuthService;
let userId: number;
let roleId: number;
let userRoleId: number;

const testUser: CreateUserPayload = {
  email: "testuser@example.com",
  username: "testuser",
  hashedPassword: "hashedpassword",
  lastLoginAt: new Date(),
};

const testRole: CreateRolePayload = {
  name: "TEST_ROLE",
  description: "A test role",
};

describe("AuthService", () => {
  beforeAll(async () => {
    authService = new AuthService();
    // Clean up test data
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.role.deleteMany({ where: { name: testRole.name } });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.role.deleteMany({ where: { name: testRole.name } });
    await prisma.$disconnect();
  });

  it("should create a user", async () => {
    const user = await authService.createUser(testUser);
    expect(user).toBeDefined();
    expect(user.email).toBe(testUser.email);
    userId = user.id;
  });

  it("should get user by id", async () => {
    const user = await authService.getUserById(userId);
    expect(user).toBeDefined();
    expect(user?.email).toBe(testUser.email);
  });

  it("should get user by email", async () => {
    const user = await authService.getUserByEmail(testUser.email);
    expect(user).toBeDefined();
    expect(user?.id).toBe(userId);
  });

  it("should update a user", async () => {
    const updatePayload: UpdateUserPayload = { username: "updateduser" };
    const updated = await authService.updateUser(userId, updatePayload);
    expect(updated.username).toBe("updateduser");
  });

  it("should create a role", async () => {
    const role = await authService.createRole(testRole);
    expect(role).toBeDefined();
    expect(role.name).toBe(testRole.name);
    roleId = role.id;
  });

  it("should get role by id", async () => {
    const role = await authService.getRoleById(roleId);
    expect(role).toBeDefined();
    expect(role?.name).toBe(testRole.name);
  });

  it("should get role by name", async () => {
    const role = await authService.getRoleByName(testRole.name);
    expect(role).toBeDefined();
    expect(role?.id).toBe(roleId);
  });

  it("should update a role", async () => {
    const updatePayload: UpdateRolePayload = { description: "Updated desc" };
    const updated = await authService.updateRole(roleId, updatePayload);
    expect(updated.description).toBe("Updated desc");
  });

  it("should assign role to user", async () => {
    const userRole = await authService.assignRoleToUser(userId, roleId);
    expect(userRole).toBeDefined();
    expect(userRole.userId).toBe(userId);
    expect(userRole.roleId).toBe(roleId);
    userRoleId = userRole.id;
  });

  it("should get user roles", async () => {
    const userRoles = await authService.getUserRoles(userId);
    expect(userRoles.length).toBeGreaterThan(0);
    expect(userRoles[0].role.name).toBe(testRole.name);
  });

  it("should remove user role", async () => {
    const removed = await authService.removeUserRole(userRoleId);
    expect(removed.id).toBe(userRoleId);
  });

  it("should delete user", async () => {
    const deleted = await authService.deleteUser(userId);
    expect(deleted.id).toBe(userId);
  });

  it("should delete role", async () => {
    const deleted = await authService.deleteRole(roleId);
    expect(deleted.id).toBe(roleId);
  });
});
