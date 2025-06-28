import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create random membership data
function createRandomMembershipData() {
  return {
    name: faker.helpers.arrayElement([
      "Basic Membership",
      "Premium Membership",
      "VIP Membership",
      "Student Membership",
    ]),
    description: faker.lorem.sentences(2),
  };
}

// Create random service data for a membership
function createRandomServiceData(membershipId: number) {
  return {
    membershipId: membershipId,
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
  };
}

// Create random member data
function createRandomMemberData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName: firstName,
    middleName: faker.helpers.maybe(() => faker.person.middleName(), {
      probability: 0.3,
    }),
    lastName: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: "age" }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
  };
}

// Create random instructor data
function createRandomInstructorData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName: firstName,
    middleName: faker.helpers.maybe(() => faker.person.middleName(), {
      probability: 0.3,
    }),
    lastName: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    dateOfBirth: faker.date.birthdate({ min: 22, max: 50, mode: "age" }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
  };
}

// Create random member registration data
function createRandomMemberRegistrationData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName: firstName,
    middleName: faker.helpers.maybe(() => faker.person.middleName(), {
      probability: 0.3,
    }),
    lastName: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: "age" }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
    dateOfApplication: faker.date.recent({ days: 30 }),
    appliedMembership: faker.helpers.arrayElement([
      "Basic Membership",
      "Premium Membership",
      "VIP Membership",
    ]),
    monthOfApplication: faker.date
      .recent({ days: 30 })
      .toLocaleString("default", { month: "long" }),
  };
}

// Seed memberships and their services
async function seedMemberships() {
  const memberships = [];

  for (let i = 0; i < 4; i++) {
    const membership = await prisma.membership.create({
      data: createRandomMembershipData(),
    });

    // Create 2-4 services for each membership
    const serviceCount = faker.number.int({ min: 2, max: 4 });
    for (let j = 0; j < serviceCount; j++) {
      await prisma.service.create({
        data: createRandomServiceData(membership.id),
      });
    }

    memberships.push(membership);
  }

  return memberships;
}

// Seed instructors with account credentials
async function seedInstructors() {
  const instructors = [];

  for (let i = 0; i < 5; i++) {
    const instructorData = createRandomInstructorData();
    const instructor = await prisma.instructor.create({
      data: instructorData,
    });

    // Create account credentials for each instructor
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.instructorAccountCredentials.create({
      data: {
        instructorId: instructor.id,
        username: faker.internet.userName({
          firstName: instructorData.firstName,
          lastName: instructorData.lastName,
        }),
        hashedPassword: hashedPassword,
      },
    });

    instructors.push(instructor);
  }

  return instructors;
}

// Seed members with account credentials and subscriptions
async function seedMembers(memberships: any[]) {
  const members = [];

  for (let i = 0; i < 15; i++) {
    const memberData = createRandomMemberData();
    const member = await prisma.member.create({
      data: memberData,
    });

    // Create account credentials for each member
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.memberAccountCredentials.create({
      data: {
        memberId: member.id,
        username: faker.internet.userName({
          firstName: memberData.firstName,
          lastName: memberData.lastName,
        }),
        hashedPassword: hashedPassword,
      },
    });

    // Create a subscription for each member
    const randomMembership = faker.helpers.arrayElement(memberships);
    const startDate = faker.date.recent({ days: 90 });
    await prisma.memberSubscription.create({
      data: {
        memberId: member.id,
        membershipId: randomMembership.id,
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year later
        status: faker.helpers.arrayElement(["ACTIVE", "EXPIRED", "SUSPENDED"]),
      },
    });

    // Create preference log for some members
    if (faker.datatype.boolean()) {
      await prisma.memberPreferenceLog.create({
        data: {
          memberId: member.id,
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

    members.push(member);
  }

  return members;
}

// Seed member registrations
async function seedMemberRegistrations() {
  const registrations = [];

  for (let i = 0; i < 8; i++) {
    const registration = await prisma.memberRegistration.create({
      data: createRandomMemberRegistrationData(),
    });

    registrations.push(registration);
  }

  return registrations;
}

// Seed standard programs and enrollments
async function seedStandardPrograms(
  instructors: any[],
  memberships: any[],
  members: any[]
) {
  const programs = [];

  for (let i = 0; i < 6; i++) {
    const program = await prisma.standardProgram.create({
      data: {
        instructorId: faker.helpers.arrayElement(instructors).id,
        membershipId: faker.helpers.arrayElement(memberships).id,
        name: faker.helpers.arrayElement([
          "Weight Loss Program",
          "Muscle Building Program",
          "Cardio Fitness Program",
          "Strength Training Program",
          "Flexibility Program",
        ]),
        description: faker.lorem.sentences(3),
      },
    });

    // Create 2-5 enrollments for each program
    const enrollmentCount = faker.number.int({ min: 2, max: 5 });
    for (let j = 0; j < enrollmentCount; j++) {
      const startDate = faker.date.recent({ days: 60 });
      await prisma.standardProgramEnrollment.create({
        data: {
          memberId: faker.helpers.arrayElement(members).id,
          standardProgramId: program.id,
          goals: faker.lorem.sentences(1),
          startDate: startDate,
          endDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months later
        },
      });
    }

    programs.push(program);
  }

  return programs;
}

// Seed personalized programs and enrollments with progress logs
async function seedPersonalizedPrograms(instructors: any[], members: any[]) {
  const programs = [];

  for (let i = 0; i < 8; i++) {
    const program = await prisma.personalizedProgram.create({
      data: {
        memberId: faker.helpers.arrayElement(members).id,
        instructorId: faker.helpers.arrayElement(instructors).id,
        name: `Personalized ${faker.helpers.arrayElement([
          "Weight Loss",
          "Muscle Building",
          "Endurance",
          "Rehabilitation",
        ])} Program`,
        description: faker.lorem.sentences(3),
      },
    });

    // Create enrollment for the personalized program
    const startDate = faker.date.recent({ days: 30 });
    const enrollment = await prisma.personalizedProgramEnrollment.create({
      data: {
        personalizedProgramId: program.id,
        goals: faker.lorem.sentences(2),
        startDate: startDate,
        endDate: new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000), // 4 months later
      },
    });

    // Create 2-4 progress logs for each enrollment
    const logCount = faker.number.int({ min: 2, max: 4 });
    for (let j = 0; j < logCount; j++) {
      await prisma.memberPersonalizedProgressLog.create({
        data: {
          personalizedProgramEnrollmentId: enrollment.id,
          progress: faker.lorem.sentences(2),
        },
      });
    }

    programs.push(program);
  }

  return programs;
}

// Seed admin users
async function seedAdmins() {
  const admins = [];

  for (let i = 0; i < 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const admin = await prisma.admin.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: faker.internet.email({ firstName, lastName }),
        role: faker.helpers.arrayElement(["SUPER_ADMIN", "ADMIN", "MANAGER"]),
      },
    });

    // Create admin credentials
    const hashedPassword = await bcrypt.hash("adminpass123", 10);
    await prisma.adminAccountCredentials.create({
      data: {
        adminId: admin.id,
        username: faker.internet.userName({ firstName, lastName }),
        hashedPassword: hashedPassword,
      },
    });

    admins.push(admin);
  }

  return admins;
}

// Seed activity logs
async function seedActivityLogs(
  members: any[],
  instructors: any[],
  admins: any[]
) {
  const actions = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW"];

  for (let i = 0; i < 50; i++) {
    const userType = faker.helpers.arrayElement([
      "MEMBER",
      "INSTRUCTOR",
      "ADMIN",
    ]);
    let userId;

    switch (userType) {
      case "MEMBER":
        userId = faker.helpers.arrayElement(members).id;
        break;
      case "INSTRUCTOR":
        userId = faker.helpers.arrayElement(instructors).id;
        break;
      case "ADMIN":
        userId = faker.helpers.arrayElement(admins).id;
        break;
    }

    await prisma.activityLog.create({
      data: {
        userId: userId!,
        userType: userType,
        action: faker.helpers.arrayElement(actions),
        description: faker.lorem.sentence(),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
      },
    });
  }
}

async function main() {
  // Clean the database first using a transaction for safety
  await prisma.$transaction([
    prisma.activityLog.deleteMany({}),
    prisma.memberPersonalizedProgressLog.deleteMany({}),
    prisma.personalizedProgramEnrollment.deleteMany({}),
    prisma.personalizedProgram.deleteMany({}),
    prisma.standardProgramEnrollment.deleteMany({}),
    prisma.standardProgram.deleteMany({}),
    prisma.memberPreferenceLog.deleteMany({}),
    prisma.memberSubscription.deleteMany({}),
    prisma.memberAccountCredentials.deleteMany({}),
    prisma.member.deleteMany({}),
    prisma.memberRegistration.deleteMany({}),
    prisma.instructorAccountCredentials.deleteMany({}),
    prisma.instructor.deleteMany({}),
    prisma.adminAccountCredentials.deleteMany({}),
    prisma.admin.deleteMany({}),
    prisma.service.deleteMany({}),
    prisma.membership.deleteMany({}),
  ]);

  console.log("🧹 Database cleaned");

  // Seed data in dependency order
  const memberships = await seedMemberships();
  console.log(`✅ Created ${memberships.length} memberships with services`);

  const instructors = await seedInstructors();
  console.log(`✅ Created ${instructors.length} instructors with credentials`);

  const members = await seedMembers(memberships);
  console.log(
    `✅ Created ${members.length} members with credentials and subscriptions`
  );

  const registrations = await seedMemberRegistrations();
  console.log(`✅ Created ${registrations.length} member registrations`);

  const standardPrograms = await seedStandardPrograms(
    instructors,
    memberships,
    members
  );
  console.log(
    `✅ Created ${standardPrograms.length} standard programs with enrollments`
  );

  const personalizedPrograms = await seedPersonalizedPrograms(
    instructors,
    members
  );
  console.log(
    `✅ Created ${personalizedPrograms.length} personalized programs with enrollments and progress logs`
  );

  const admins = await seedAdmins();
  console.log(`✅ Created ${admins.length} admin users with credentials`);

  await seedActivityLogs(members, instructors, admins);
  console.log("✅ Created activity logs");

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
