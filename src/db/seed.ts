import { PrismaClient } from "@prisma/client";
import type {
  Person as PrismaPerson,
  Membership as PrismaMembership,
  Program as PrismaProgram,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// --- Seed Memberships and Services ---
async function seedMemberships() {
  const memberships = [];
  for (let i = 0; i < 3; i++) {
    const membership = await prisma.membership.create({
      data: {
        name: faker.helpers.arrayElement([
          "Basic Membership",
          "Premium Membership",
          "VIP Membership",
        ]),
        description: faker.lorem.sentences(2),
      },
    });
    // Create 2-3 services for each membership
    const serviceCount = faker.number.int({ min: 2, max: 3 });
    for (let j = 0; j < serviceCount; j++) {
      await prisma.service.create({
        data: {
          membershipId: membership.id,
          name: faker.helpers.arrayElement([
            "Personal Training",
            "Group Classes",
            "Nutrition Consultation",
            "Fitness Assessment",
            "Equipment Access",
          ]),
          availability: faker.helpers.arrayElement([
            "Mon-Fri 6AM-10PM",
            "24/7 Access",
            "Weekends Only",
            "By Appointment",
          ]),
        },
      });
    }
    memberships.push(membership);
  }
  return memberships;
}

// --- Seed Persons ---
async function seedPersons(users: { id: number }[]): Promise<PrismaPerson[]> {
  const persons: PrismaPerson[] = [];
  for (let i = 0; i < users.length; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const person = await prisma.person.create({
      data: {
        userId: users[i].id,
        firstName,
        middleName: faker.helpers.maybe(() => faker.person.middleName(), {
          probability: 0.3,
        }),
        lastName,
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: "age" }),
        phone: faker.phone.number(),
        personalEmail: faker.internet.email({ firstName, lastName }),
        dateOfApplication: faker.date.recent({ days: 30 }),
        appliedMembership: faker.helpers.arrayElement([
          "Basic Membership",
          "Premium Membership",
          "VIP Membership",
        ]),
        monthOfApplication: faker.date
          .recent({ days: 30 })
          .toLocaleString("default", { month: "long" }),
      },
    });
    persons.push(person);
  }
  return persons;
}

// --- Seed MemberSubscriptions ---
async function seedMemberSubscriptions(
  persons: PrismaPerson[],
  memberships: PrismaMembership[]
): Promise<void> {
  for (const person of persons) {
    const membership = faker.helpers.arrayElement(memberships);
    await prisma.memberSubscription.create({
      data: {
        personId: person.id,
        membershipId: membership.id,
        startDate: faker.date.recent({ days: 90 }),
        endDate: faker.date.soon({ days: 365 }),
        status: faker.helpers.arrayElement([
          "ACTIVE",
          "EXPIRED",
          "SUSPENDED",
        ]) as "ACTIVE" | "EXPIRED" | "SUSPENDED",
      },
    });
  }
}

// --- Seed MemberStandardPreferenceLog ---
async function seedPreferenceLogs(persons: PrismaPerson[]): Promise<void> {
  for (const person of persons) {
    if (faker.datatype.boolean()) {
      await prisma.memberStandardPreferenceLog.create({
        data: {
          personId: person.id,
          goals: faker.lorem.sentences(2),
          recordedAvailability: faker.helpers.arrayElement([
            "Morning 6AM-9AM",
            "Evening 6PM-9PM",
            "Weekends",
            "Flexible",
          ]),
        },
      });
    }
  }
}

// --- Seed Programs ---
async function seedPrograms(
  persons: PrismaPerson[],
  memberships: PrismaMembership[]
): Promise<PrismaProgram[]> {
  const programs: PrismaProgram[] = [];
  for (let i = 0; i < 5; i++) {
    const creator = faker.helpers.arrayElement(persons);
    const membership = faker.helpers.arrayElement(memberships);
    const program = await prisma.program.create({
      data: {
        creatorId: creator.id,
        membershipId: membership.id,
        name: faker.helpers.arrayElement([
          "Weight Loss Program",
          "Muscle Building Program",
          "Cardio Fitness Program",
          "Strength Training Program",
          "Flexibility Program",
        ]),
        description: faker.lorem.sentences(3),
        type: faker.helpers.arrayElement(["STANDARD", "PERSONALIZED"]) as
          | "STANDARD"
          | "PERSONALIZED",
        isActive: true,
      },
    });
    programs.push(program);
  }
  return programs;
}

// --- Seed Enrollments and ProgressLogs ---
async function seedEnrollmentsAndProgress(
  persons: PrismaPerson[],
  programs: PrismaProgram[]
): Promise<void> {
  for (const person of persons) {
    const program = faker.helpers.arrayElement(programs);
    const enrollment = await prisma.enrollment.create({
      data: {
        personId: person.id,
        programId: program.id,
        goals: faker.lorem.sentence(),
        startDate: faker.date.recent({ days: 60 }),
        endDate: faker.date.soon({ days: 90 }),
        isActive: true,
      },
    });
    // Add 1-2 progress logs
    const logCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < logCount; i++) {
      await prisma.progressLog.create({
        data: {
          personId: person.id,
          enrollmentId: enrollment.id,
          progress: faker.lorem.sentences(2),
        },
      });
    }
  }
}

// --- Seed ActivityLogs ---
async function seedActivityLogs(persons: PrismaPerson[]): Promise<void> {
  for (let i = 0; i < 20; i++) {
    const person = faker.helpers.arrayElement(persons);
    await prisma.activityLog.create({
      data: {
        personId: person.id,
        activityType: faker.helpers.arrayElement([
          "WORKOUT",
          "CHECKIN",
          "PROGRAM_START",
        ]) as "WORKOUT" | "CHECKIN" | "PROGRAM_START",
        activityName: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        duration: faker.number.int({ min: 30, max: 120 }),
        calories: faker.number.int({ min: 100, max: 800 }),
        notes: faker.lorem.sentence(),
        recordedAt: faker.date.recent(),
      },
    });
  }
}

// --- Main Seeder ---
import { seedAuth } from "./seed.auth";

async function main() {
  // Clean the database first using a transaction for safety
  await prisma.$transaction([
    prisma.activityLog.deleteMany({}),
    prisma.progressLog.deleteMany({}),
    prisma.enrollment.deleteMany({}),
    prisma.program.deleteMany({}),
    prisma.memberStandardPreferenceLog.deleteMany({}),
    prisma.memberSubscription.deleteMany({}),
    prisma.person.deleteMany({}),
    prisma.service.deleteMany({}),
    prisma.membership.deleteMany({}),
    prisma.userRole.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.role.deleteMany({}),
  ]);
  console.log("🧹 Database cleaned");

  // --- Auth Seeder ---
  const { users, roles } = await seedAuth();

  // --- Business Seeder ---
  const memberships = await seedMemberships();
  const persons = await seedPersons(users);
  await seedMemberSubscriptions(persons, memberships);
  await seedPreferenceLogs(persons);
  const programs = await seedPrograms(persons, memberships);
  await seedEnrollmentsAndProgress(persons, programs);
  await seedActivityLogs(persons);
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
