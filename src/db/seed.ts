import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create random membership data
function createRandomMembershipData() {
  return {
    membership_name: faker.helpers.arrayElement([
      "Basic Membership",
      "Premium Membership", 
      "VIP Membership",
      "Student Membership"
    ]),
    membership_description: faker.lorem.sentences(2),
  };
}

// Create random service data for a membership
function createRandomServiceData(membershipId: number) {
  return {
    membership_id: membershipId,
    service_name: faker.helpers.arrayElement([
      "Personal Training",
      "Group Classes",
      "Nutrition Consultation",
      "Fitness Assessment",
      "Equipment Access"
    ]),
    service_availability: faker.helpers.arrayElement([
      "Mon-Fri 6AM-10PM",
      "24/7 Access",
      "Weekends Only",
      "By Appointment"
    ]),
  };
}

// Create random member data
function createRandomMemberData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    first_name: firstName,
    middle_name: faker.helpers.maybe(() => faker.person.middleName(), { probability: 0.3 }),
    last_name: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    date_of_birth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
  };
}

// Create random instructor data
function createRandomInstructorData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    first_name: firstName,
    middle_name: faker.helpers.maybe(() => faker.person.middleName(), { probability: 0.3 }),
    last_name: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    date_of_birth: faker.date.birthdate({ min: 22, max: 50, mode: 'age' }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
  };
}

// Create random member registration data
function createRandomMemberRegistrationData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    first_name: firstName,
    middle_name: faker.helpers.maybe(() => faker.person.middleName(), { probability: 0.3 }),
    last_name: lastName,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    date_of_birth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    email: faker.internet.email({ firstName, lastName }),
    number: faker.phone.number(),
    date_of_application: faker.date.recent({ days: 30 }),
    service_membership: faker.helpers.arrayElement([
      "Basic Membership",
      "Premium Membership",
      "VIP Membership"
    ]),
    month_of_application: faker.date.recent({ days: 30 }).getMonth() + 1,
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
        data: createRandomServiceData(membership.membership_id),
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
        instructor_id: instructor.instructor_id,
        username: faker.internet.userName({ firstName: instructorData.first_name, lastName: instructorData.last_name }),
        hashed_password: hashedPassword,
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
        member_id: member.member_id,
        username: faker.internet.userName({ firstName: memberData.first_name, lastName: memberData.last_name }),
        hashed_password: hashedPassword,
      },
    });
    
    // Create a subscription for each member
    const randomMembership = faker.helpers.arrayElement(memberships);
    const startDate = faker.date.recent({ days: 90 });
    await prisma.memberSubscription.create({
      data: {
        member_id: member.member_id,
        membership_id: randomMembership.membership_id,
        start_date: startDate,
        end_date: new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year later
        subscription_status: faker.helpers.arrayElement(["Active", "Expired", "Suspended"]),
      },
    });
    
    members.push(member);
  }
  
  return members;
}

// Seed member registrations with preference logs
async function seedMemberRegistrations() {
  const registrations = [];
  
  for (let i = 0; i < 8; i++) {
    const registration = await prisma.memberRegistration.create({
      data: createRandomMemberRegistrationData(),
    });
    
    // Create preference log for each registration
    await prisma.memberStandardPreferenceLog.create({
      data: {
        registration_id: registration.registration_id,
        goals: faker.lorem.sentences(2),
        recorded_availability: faker.helpers.arrayElement([
          "Morning 6AM-9AM",
          "Evening 6PM-9PM",
          "Weekends",
          "Flexible"
        ]),
      },
    });
    
    registrations.push(registration);
  }
  
  return registrations;
}

// Seed standard programs and enrollments
async function seedStandardPrograms(instructors: any[], memberships: any[], members: any[]) {
  const programs = [];
  
  for (let i = 0; i < 6; i++) {
    const program = await prisma.standardProgram.create({
      data: {
        instructor_id: faker.helpers.arrayElement(instructors).instructor_id,
        membership_id: faker.helpers.arrayElement(memberships).membership_id,
        personalized_program_name: faker.helpers.arrayElement([
          "Weight Loss Program",
          "Muscle Building Program",
          "Cardio Fitness Program",
          "Strength Training Program",
          "Flexibility Program"
        ]),
        personalized_program_description: faker.lorem.sentences(3),
      },
    });
    
    // Create 2-5 enrollments for each program
    const enrollmentCount = faker.number.int({ min: 2, max: 5 });
    for (let j = 0; j < enrollmentCount; j++) {
      const startDate = faker.date.recent({ days: 60 });
      const saDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week later
      await prisma.standardProgramEnrollment.create({
        data: {
          member_id: faker.helpers.arrayElement(members).member_id,
          standard_program_id: program.standard_program_id,
          goals: faker.lorem.sentences(1),
          start_date: startDate,
          sa_date: saDate,
          end_date: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months later
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
        member_id: faker.helpers.arrayElement(members).member_id,
        instructor_id: faker.helpers.arrayElement(instructors).instructor_id,
        personalized_program_name: `Personalized ${faker.helpers.arrayElement([
          "Weight Loss",
          "Muscle Building", 
          "Endurance",
          "Rehabilitation"
        ])} Program`,
        personalized_program_description: faker.lorem.sentences(3),
      },
    });
    
    // Create enrollment for the personalized program
    const startDate = faker.date.recent({ days: 30 });
    const enrollment = await prisma.personalizedProgramEnrollment.create({
      data: {
        personalized_program_id: program.personalized_program_id,
        goals: faker.lorem.sentences(2),
        start_date: startDate,
        end_date: new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000), // 4 months later
        deadline: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months later
      },
    });
    
    // Create 2-4 progress logs for each enrollment
    const logCount = faker.number.int({ min: 2, max: 4 });
    for (let j = 0; j < logCount; j++) {
      await prisma.memberPersonalizedProgramsLog.create({
        data: {
          personalized_program_enrollment_id: enrollment.personalized_program_enrollment_id,
          progress: faker.lorem.sentences(2),
        },
      });
    }
    
    programs.push(program);
  }
  
  return programs;
}

async function main() {
  // Clean the database first using a transaction for safety
  await prisma.$transaction([
    prisma.memberPersonalizedProgramsLog.deleteMany({}),
    prisma.personalizedProgramEnrollment.deleteMany({}),
    prisma.personalizedProgram.deleteMany({}),
    prisma.memberStandardPreferenceLog.deleteMany({}),
    prisma.standardProgramEnrollment.deleteMany({}),
    prisma.standardProgram.deleteMany({}),
    prisma.memberSubscription.deleteMany({}),
    prisma.memberAccountCredentials.deleteMany({}),
    prisma.member.deleteMany({}),
    prisma.memberRegistration.deleteMany({}),
    prisma.instructorAccountCredentials.deleteMany({}),
    prisma.instructor.deleteMany({}),
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
  console.log(`✅ Created ${members.length} members with credentials and subscriptions`);

  const registrations = await seedMemberRegistrations();
  console.log(`✅ Created ${registrations.length} member registrations with preference logs`);

  const standardPrograms = await seedStandardPrograms(instructors, memberships, members);
  console.log(`✅ Created ${standardPrograms.length} standard programs with enrollments`);

  const personalizedPrograms = await seedPersonalizedPrograms(instructors, members);
  console.log(`✅ Created ${personalizedPrograms.length} personalized programs with enrollments and progress logs`);

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
