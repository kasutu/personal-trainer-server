import { PrismaClient } from "@prisma/client";
import type { User, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// --- Seed Default Roles ---
export async function seedRoles() {
  const defaultRoles = [
    { name: "USER", description: "Standard user role" },
    { name: "ADMIN", description: "Administrator role" },
    { name: "INSTRUCTOR", description: "Gym instructor role" },
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

// --- Seed Site Master User ---
export async function seedSiteMaster(): Promise<{
  user: User;
  password: string;
}> {
  const password = "masterpwd";
  const hashedPassword = await bcrypt.hash(password, 10);
  const email = "site-master@pt.com";
  const username = "site-master";
  const user = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword },
    create: {
      email,
      username,
      hashedPassword,
      lastLoginAt: null,
    },
  });
  return { user, password };
}

// --- Main Auth Seeder ---
export async function seedAuth() {
  // Cleanup for idempotency
  await prisma.userRole.deleteMany({});
  await prisma.user.deleteMany({
    where: { email: "site-master@pt.com" },
  });
  await prisma.role.deleteMany({});

  await seedRoles();
  const roles = await prisma.role.findMany();
  const { user, password } = await seedSiteMaster();
  const adminRole = roles.find((r) => r.name === "ADMIN");
  if (adminRole) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });
  }
  return { user, password };
}

if (require.main === module) {
  seedAuth()
    .then(async ({ user, password }) => {
      await prisma.$disconnect();
      console.log("🎉 Auth seeding completed successfully!");
      console.log(
        `Admin username: ${user.username}\nAdmin Email: ${user.email}\nAdmin Password: ${password}`
      );
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
