import { PrismaClient } from "@prisma/client";
import type { User, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// --- Seed Default Roles ---
export async function seedRoles() {
  const defaultRoles = [
    { name: "ADMIN", description: "Administrator role" },
    { name: "USER", description: "Standard user role" },
    { name: "MANAGER", description: "Manager role" },
  ];
  for (const role of defaultRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log(`✅ Seeded ${defaultRoles.length} roles`);
}

// --- Seed Users ---
export async function seedUsers(): Promise<User[]> {
  const users: User[] = [];
  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
        lastLoginAt: faker.date.recent(),
      },
    });
    users.push(user);
  }
  return users;
}

export async function seedUserRoles(
  users: User[],
  roles: Role[]
): Promise<void> {
  // Assign ADMIN to first user, USER to others
  for (let i = 0; i < users.length; i++) {
    const role: Role | undefined =
      i === 0
        ? roles.find((r) => r.name === "ADMIN")
        : roles.find((r) => r.name === "USER");
    if (role) {
      await prisma.userRole.create({
        data: {
          userId: users[i].id,
          roleId: role.id,
        },
      });
    }
  }
}

// --- Main Auth Seeder ---
export async function seedAuth() {
  // Cleanup for idempotency
  await prisma.userRole.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  await seedRoles();
  const roles = await prisma.role.findMany();
  const users = await seedUsers();
  await seedUserRoles(users, roles);
  return { users, roles };
}

if (require.main === module) {
  seedAuth()
    .then(async () => {
      await prisma.$disconnect();
      console.log("🎉 Auth seeding completed successfully!");
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
