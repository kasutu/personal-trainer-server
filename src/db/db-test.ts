import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface TestResults {
  passed: number;
  failed: number;
  errors: string[];
}

const testResults: TestResults = {
  passed: 0,
  failed: 0,
  errors: [],
};

// Utility function to log test results
function logTest(
  operation: string,
  entity: string,
  success: boolean,
  error?: any
) {
  if (success) {
    testResults.passed++;
    console.log(`✅ ${operation} ${entity} - PASSED`);
  } else {
    testResults.failed++;
    testResults.errors.push(
      `❌ ${operation} ${entity} - FAILED: ${error?.message || error}`
    );
    console.log(
      `❌ ${operation} ${entity} - FAILED: ${error?.message || error}`
    );
  }
}

// MEMBERSHIP CRUD TESTS
async function testMembershipCRUD() {
  console.log("\n🧪 Testing Membership CRUD Operations");
  let membershipId: number | null = null;

  // CREATE Test
  try {
    const membership = await prisma.membership.create({
      data: {
        name: "Test Premium Membership",
        description: "Premium membership for testing CRUD operations",
      },
    });
    membershipId = membership.id;
    logTest("CREATE", "Membership", true);
  } catch (error) {
    logTest("CREATE", "Membership", false, error);
    return;
  }

  // READ Test
  try {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId! },
    });
    if (!membership) throw new Error("Membership not found");
    logTest("READ", "Membership", true);
  } catch (error) {
    logTest("READ", "Membership", false, error);
  }

  // UPDATE Test
  try {
    await prisma.membership.update({
      where: { id: membershipId! },
      data: { description: "Updated premium membership description" },
    });
    logTest("UPDATE", "Membership", true);
  } catch (error) {
    logTest("UPDATE", "Membership", false, error);
  }

  // DELETE Test
  try {
    await prisma.membership.delete({
      where: { id: membershipId! },
    });
    logTest("DELETE", "Membership", true);
  } catch (error) {
    logTest("DELETE", "Membership", false, error);
  }
}

// SERVICE CRUD TESTS
async function testServiceCRUD() {
  console.log("\n🧪 Testing Service CRUD Operations");
  let serviceId: number | null = null;
  let membershipId: number | null = null;

  // First create a membership for the service
  try {
    const membership = await prisma.membership.create({
      data: {
        name: "Service Test Membership",
        description: "Membership for service testing",
      },
    });
    membershipId = membership.id;
  } catch (error) {
    logTest("CREATE", "Service (Setup)", false, error);
    return;
  }

  // CREATE Test
  try {
    const service = await prisma.service.create({
      data: {
        membershipId: membershipId!,
        name: "Test Personal Training",
        availability: "Mon-Fri 9AM-5PM",
      },
    });
    serviceId = service.id;
    logTest("CREATE", "Service", true);
  } catch (error) {
    logTest("CREATE", "Service", false, error);
  }

  // READ Test
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId! },
      include: { membership: true },
    });
    if (!service) throw new Error("Service not found");
    logTest("READ", "Service", true);
  } catch (error) {
    logTest("READ", "Service", false, error);
  }

  // UPDATE Test
  try {
    await prisma.service.update({
      where: { id: serviceId! },
      data: { availability: "24/7 Access" },
    });
    logTest("UPDATE", "Service", true);
  } catch (error) {
    logTest("UPDATE", "Service", false, error);
  }

  // DELETE Test
  try {
    await prisma.service.delete({
      where: { id: serviceId! },
    });
    await prisma.membership.delete({
      where: { id: membershipId! },
    });
    logTest("DELETE", "Service", true);
  } catch (error) {
    logTest("DELETE", "Service", false, error);
  }
}

// MEMBER CRUD TESTS
async function testMemberCRUD() {
  console.log("\n🧪 Testing Member CRUD Operations");
  let memberId: number | null = null;

  // CREATE Test
  try {
    const member = await prisma.member.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        dateOfBirth: new Date("1990-01-01"),
        email: "john.doe.test@example.com",
        number: "1234567890",
      },
    });
    memberId = member.id;
    logTest("CREATE", "Member", true);
  } catch (error) {
    logTest("CREATE", "Member", false, error);
    return;
  }

  // CREATE Member Credentials
  try {
    const hashedPassword = await bcrypt.hash("testpassword123", 10);
    await prisma.memberAccountCredentials.create({
      data: {
        memberId: memberId!,
        username: "johndoe_test",
        hashedPassword: hashedPassword,
      },
    });
    logTest("CREATE", "Member Credentials", true);
  } catch (error) {
    logTest("CREATE", "Member Credentials", false, error);
  }

  // READ Test
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId! },
      include: {
        credentials: true,
        subscriptions: true,
      },
    });
    if (!member) throw new Error("Member not found");
    logTest("READ", "Member", true);
  } catch (error) {
    logTest("READ", "Member", false, error);
  }

  // UPDATE Test
  try {
    await prisma.member.update({
      where: { id: memberId! },
      data: { number: "0987654321" },
    });
    logTest("UPDATE", "Member", true);
  } catch (error) {
    logTest("UPDATE", "Member", false, error);
  }

  // DELETE Test (credentials will be deleted via cascade)
  try {
    await prisma.member.delete({
      where: { id: memberId! },
    });
    logTest("DELETE", "Member", true);
  } catch (error) {
    logTest("DELETE", "Member", false, error);
  }
}

// INSTRUCTOR CRUD TESTS
async function testInstructorCRUD() {
  console.log("\n🧪 Testing Instructor CRUD Operations");
  let instructorId: number | null = null;

  // CREATE Test
  try {
    const instructor = await prisma.instructor.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        gender: "Female",
        dateOfBirth: new Date("1985-05-15"),
        email: "jane.smith.test@example.com",
        number: "5551234567",
      },
    });
    instructorId = instructor.id;
    logTest("CREATE", "Instructor", true);
  } catch (error) {
    logTest("CREATE", "Instructor", false, error);
    return;
  }

  // CREATE Instructor Credentials
  try {
    const hashedPassword = await bcrypt.hash("instructorpass123", 10);
    await prisma.instructorAccountCredentials.create({
      data: {
        instructorId: instructorId!,
        username: "janesmith_test",
        hashedPassword: hashedPassword,
      },
    });
    logTest("CREATE", "Instructor Credentials", true);
  } catch (error) {
    logTest("CREATE", "Instructor Credentials", false, error);
  }

  // READ Test
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId! },
      include: {
        credentials: true,
        personalizedPrograms: true,
        standardPrograms: true,
      },
    });
    if (!instructor) throw new Error("Instructor not found");
    logTest("READ", "Instructor", true);
  } catch (error) {
    logTest("READ", "Instructor", false, error);
  }

  // UPDATE Test
  try {
    await prisma.instructor.update({
      where: { id: instructorId! },
      data: { number: "5559876543" },
    });
    logTest("UPDATE", "Instructor", true);
  } catch (error) {
    logTest("UPDATE", "Instructor", false, error);
  }

  // DELETE Test
  try {
    await prisma.instructor.delete({
      where: { id: instructorId! },
    });
    logTest("DELETE", "Instructor", true);
  } catch (error) {
    logTest("DELETE", "Instructor", false, error);
  }
}

// MEMBER REGISTRATION CRUD TESTS
async function testMemberRegistrationCRUD() {
  console.log("\n🧪 Testing Member Registration CRUD Operations");
  let registrationId: number | null = null;

  // CREATE Test
  try {
    const registration = await prisma.memberRegistration.create({
      data: {
        firstName: "Test",
        lastName: "Applicant",
        gender: "Male",
        dateOfBirth: new Date("1992-03-10"),
        email: "test.applicant@example.com",
        number: "1112223333",
        dateOfApplication: new Date(),
        appliedMembership: "Premium Membership",
        monthOfApplication: "June",
      },
    });
    registrationId = registration.id;
    logTest("CREATE", "Member Registration", true);
  } catch (error) {
    logTest("CREATE", "Member Registration", false, error);
    return;
  }

  // READ Test
  try {
    const registration = await prisma.memberRegistration.findUnique({
      where: { id: registrationId! },
    });
    if (!registration) throw new Error("Member registration not found");
    logTest("READ", "Member Registration", true);
  } catch (error) {
    logTest("READ", "Member Registration", false, error);
  }

  // UPDATE Test
  try {
    await prisma.memberRegistration.update({
      where: { id: registrationId! },
      data: { status: "approved" },
    });
    logTest("UPDATE", "Member Registration", true);
  } catch (error) {
    logTest("UPDATE", "Member Registration", false, error);
  }

  // DELETE Test
  try {
    await prisma.memberRegistration.delete({
      where: { id: registrationId! },
    });
    logTest("DELETE", "Member Registration", true);
  } catch (error) {
    logTest("DELETE", "Member Registration", false, error);
  }
}

// COMPLEX RELATIONSHIP TESTS
async function testComplexRelationships() {
  console.log("\n🧪 Testing Complex Relationship Operations");

  let membershipId: number, memberId: number, instructorId: number;

  // Setup data
  try {
    const membership = await prisma.membership.create({
      data: {
        name: "Relationship Test Membership",
        description: "For testing complex relationships",
      },
    });
    membershipId = membership.id;

    // Clean up any existing test data first
    await prisma.member.deleteMany({
      where: { email: "relationship.tester@example.com" },
    });
    await prisma.instructor.deleteMany({
      where: { email: "instructor.tester@example.com" },
    });

    const member = await prisma.member.create({
      data: {
        firstName: "Relationship",
        lastName: "Tester",
        gender: "Male",
        dateOfBirth: new Date("1990-01-01"),
        email: "relationship.tester@example.com",
        number: "1234567890",
      },
    });
    memberId = member.id;

    const instructor = await prisma.instructor.create({
      data: {
        firstName: "Instructor",
        lastName: "Tester",
        gender: "Female",
        dateOfBirth: new Date("1985-01-01"),
        email: "instructor.tester@example.com",
        number: "0987654321",
      },
    });
    instructorId = instructor.id;

    logTest("CREATE", "Relationship Setup", true);
  } catch (error) {
    logTest("CREATE", "Relationship Setup", false, error);
    return;
  }

  // Test Member Subscription
  try {
    await prisma.memberSubscription.create({
      data: {
        memberId: memberId,
        membershipId: membershipId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
    logTest("CREATE", "Member Subscription", true);
  } catch (error) {
    logTest("CREATE", "Member Subscription", false, error);
  }

  // Test Standard Program
  try {
    const standardProgram = await prisma.standardProgram.create({
      data: {
        instructorId: instructorId,
        membershipId: membershipId,
        name: "Test Standard Program",
        description: "A test standard program",
      },
    });

    await prisma.standardProgramEnrollment.create({
      data: {
        memberId: memberId,
        standardProgramId: standardProgram.id,
        goals: "Test fitness goals",
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });
    logTest("CREATE", "Standard Program & Enrollment", true);
  } catch (error) {
    logTest("CREATE", "Standard Program & Enrollment", false, error);
  }

  // Test Personalized Program - FIXED RELATIONSHIPS
  try {
    const personalizedProgram = await prisma.personalizedProgram.create({
      data: {
        memberId: memberId,
        instructorId: instructorId,
        name: "Test Personalized Program",
        description: "A test personalized program",
      },
    });

    const enrollment = await prisma.personalizedProgramEnrollment.create({
      data: {
        memberId: memberId,
        personalizedProgramId: personalizedProgram.id,
        goals: "Personalized fitness goals",
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.memberPersonalizedProgressLog.create({
      data: {
        memberId: memberId, // Now properly required
        personalizedProgramEnrollmentId: enrollment.id,
        progress: "Week 1: Completed initial assessment",
      },
    });
    logTest("CREATE", "Personalized Program & Progress", true);
  } catch (error) {
    logTest("CREATE", "Personalized Program & Progress", false, error);
  }

  // Test Member Preference Log
  try {
    await prisma.memberPreferenceLog.create({
      data: {
        memberId: memberId,
        goals: "Lose weight and build muscle",
        recordedAvailability: "Evening 6PM-8PM",
      },
    });
    logTest("CREATE", "Member Preference Log", true);
  } catch (error) {
    logTest("CREATE", "Member Preference Log", false, error);
  }

  // Complex READ Test with multiple joins
  try {
    const memberWithDetails = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        subscriptions: {
          include: { membership: true },
        },
        preferenceLogs: true,
        personalizedPrograms: {
          include: {
            instructor: true,
            enrollments: {
              include: { progressLogs: true },
            },
          },
        },
        standardProgramEnrollments: {
          include: {
            standardProgram: {
              include: { instructor: true },
            },
          },
        },
        personalizedProgramEnrollments: {
          include: {
            personalizedProgram: {
              include: { instructor: true },
            },
          },
        },
        personalizedProgressLogs: true,
      },
    });
    if (!memberWithDetails) throw new Error("Complex member query failed");

    // Verify the relationships were properly created
    if (memberWithDetails.subscriptions.length === 0) {
      throw new Error("No subscriptions found");
    }
    if (memberWithDetails.personalizedPrograms.length === 0) {
      throw new Error("No personalized programs found");
    }
    if (memberWithDetails.personalizedProgramEnrollments.length === 0) {
      throw new Error("No personalized program enrollments found");
    }
    if (memberWithDetails.personalizedProgressLogs.length === 0) {
      throw new Error("No progress logs found");
    }

    logTest("READ", "Complex Member Query", true);
  } catch (error) {
    logTest("READ", "Complex Member Query", false, error);
  }

  // Test cascade delete - member should cascade properly
  try {
    await prisma.member.delete({ where: { id: memberId } });

    // Verify cascades worked
    const deletedSubscriptions = await prisma.memberSubscription.findMany({
      where: { memberId: memberId },
    });
    const deletedEnrollments =
      await prisma.personalizedProgramEnrollment.findMany({
        where: { memberId: memberId },
      });
    const deletedProgressLogs =
      await prisma.memberPersonalizedProgressLog.findMany({
        where: { memberId: memberId },
      });

    if (
      deletedSubscriptions.length > 0 ||
      deletedEnrollments.length > 0 ||
      deletedProgressLogs.length > 0
    ) {
      throw new Error("Cascade delete did not work properly");
    }

    logTest("DELETE", "Member Cascade", true);
  } catch (error) {
    logTest("DELETE", "Member Cascade", false, error);
  }

  // Cleanup remaining data
  try {
    await prisma.standardProgram.deleteMany({
      where: { instructorId: instructorId },
    });
    await prisma.instructor.delete({ where: { id: instructorId } });
    await prisma.membership.delete({ where: { id: membershipId } });
    logTest("DELETE", "Relationship Cleanup", true);
  } catch (error) {
    logTest("DELETE", "Relationship Cleanup", false, error);
  }
}

// ADMIN CRUD TESTS
async function testAdminCRUD() {
  console.log("\n🧪 Testing Admin CRUD Operations");
  let adminId: number | null = null;

  // CREATE Test
  try {
    const admin = await prisma.admin.create({
      data: {
        firstName: "Admin",
        lastName: "Test",
        email: "admin.test@example.com",
        role: "ADMIN",
      },
    });
    adminId = admin.id;

    const hashedPassword = await bcrypt.hash("adminpass123", 10);
    await prisma.adminAccountCredentials.create({
      data: {
        adminId: adminId,
        username: "admintest",
        hashedPassword: hashedPassword,
      },
    });
    logTest("CREATE", "Admin", true);
  } catch (error) {
    logTest("CREATE", "Admin", false, error);
    return;
  }

  // READ Test
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId! },
      include: { credentials: true },
    });
    if (!admin) throw new Error("Admin not found");
    logTest("READ", "Admin", true);
  } catch (error) {
    logTest("READ", "Admin", false, error);
  }

  // UPDATE Test
  try {
    await prisma.admin.update({
      where: { id: adminId! },
      data: { role: "MANAGER" },
    });
    logTest("UPDATE", "Admin", true);
  } catch (error) {
    logTest("UPDATE", "Admin", false, error);
  }

  // DELETE Test
  try {
    await prisma.admin.delete({
      where: { id: adminId! },
    });
    logTest("DELETE", "Admin", true);
  } catch (error) {
    logTest("DELETE", "Admin", false, error);
  }
}

// ACTIVITY LOG TESTS
async function testActivityLogCRUD() {
  console.log("\n🧪 Testing Activity Log CRUD Operations");
  let logId: number | null = null;

  // CREATE Test
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        userId: 1,
        userType: "MEMBER",
        action: "LOGIN",
        description: "User logged in successfully",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 Test Browser",
      },
    });
    logId = activityLog.id;
    logTest("CREATE", "Activity Log", true);
  } catch (error) {
    logTest("CREATE", "Activity Log", false, error);
    return;
  }

  // READ Test
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId: 1, userType: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    if (logs.length === 0) throw new Error("Activity logs not found");
    logTest("READ", "Activity Log", true);
  } catch (error) {
    logTest("READ", "Activity Log", false, error);
  }

  // UPDATE Test
  try {
    await prisma.activityLog.update({
      where: { id: logId! },
      data: { description: "Updated: User logged in successfully" },
    });
    logTest("UPDATE", "Activity Log", true);
  } catch (error) {
    logTest("UPDATE", "Activity Log", false, error);
  }

  // DELETE Test
  try {
    await prisma.activityLog.delete({
      where: { id: logId! },
    });
    logTest("DELETE", "Activity Log", true);
  } catch (error) {
    logTest("DELETE", "Activity Log", false, error);
  }
}

// BATCH OPERATIONS TESTS
async function testBatchOperations() {
  console.log("\n🧪 Testing Batch Operations");

  // Batch CREATE Test
  try {
    await prisma.membership.createMany({
      data: [
        { name: "Batch Test 1", description: "First batch membership" },
        { name: "Batch Test 2", description: "Second batch membership" },
        { name: "Batch Test 3", description: "Third batch membership" },
      ],
    });
    logTest("CREATE MANY", "Memberships", true);
  } catch (error) {
    logTest("CREATE MANY", "Memberships", false, error);
  }

  // Batch READ Test
  try {
    const memberships = await prisma.membership.findMany({
      where: {
        name: {
          startsWith: "Batch Test",
        },
      },
    });
    if (memberships.length !== 3)
      throw new Error("Batch read returned incorrect count");
    logTest("READ MANY", "Memberships", true);
  } catch (error) {
    logTest("READ MANY", "Memberships", false, error);
  }

  // Batch UPDATE Test
  try {
    await prisma.membership.updateMany({
      where: {
        name: {
          startsWith: "Batch Test",
        },
      },
      data: {
        description: "Updated batch membership description",
      },
    });
    logTest("UPDATE MANY", "Memberships", true);
  } catch (error) {
    logTest("UPDATE MANY", "Memberships", false, error);
  }

  // Batch DELETE Test
  try {
    await prisma.membership.deleteMany({
      where: {
        name: {
          startsWith: "Batch Test",
        },
      },
    });
    logTest("DELETE MANY", "Memberships", true);
  } catch (error) {
    logTest("DELETE MANY", "Memberships", false, error);
  }
}

// TRANSACTION TESTS
async function testTransactions() {
  console.log("\n🧪 Testing Transaction Operations");

  // Successful Transaction Test
  try {
    await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.create({
        data: {
          name: "Transaction Test Membership",
          description: "Created in transaction",
        },
      });

      await tx.service.create({
        data: {
          membershipId: membership.id,
          name: "Transaction Test Service",
          availability: "24/7",
        },
      });
    });
    logTest("TRANSACTION", "Successful", true);
  } catch (error) {
    logTest("TRANSACTION", "Successful", false, error);
  }

  // Failed Transaction Test (should rollback)
  try {
    await prisma.$transaction(async (tx) => {
      await tx.membership.create({
        data: {
          name: "Transaction Rollback Test",
          description: "Should be rolled back",
        },
      });

      // This should fail and rollback the entire transaction
      await tx.service.create({
        data: {
          membershipId: 99999, // Non-existent membership ID
          name: "This should fail",
          availability: "Never",
        },
      });
    });
    logTest("TRANSACTION", "Rollback", false, "Transaction should have failed");
  } catch (error) {
    // Check that rollback worked
    const membership = await prisma.membership.findFirst({
      where: { name: "Transaction Rollback Test" },
    });
    if (!membership) {
      logTest("TRANSACTION", "Rollback", true);
    } else {
      logTest("TRANSACTION", "Rollback", false, "Rollback failed");
    }
  }

  // Cleanup transaction test data
  try {
    await prisma.membership.deleteMany({
      where: {
        name: {
          contains: "Transaction",
        },
      },
    });
  } catch (error) {
    console.log("Cleanup error:", error);
  }
}

// INDEX PERFORMANCE TESTS
async function testIndexPerformance() {
  console.log("\n🧪 Testing Index Performance");

  // Test email index on Member
  try {
    const startTime = Date.now();
    await prisma.member.findMany({
      where: { email: { contains: "@example.com" } },
      take: 100,
    });
    const endTime = Date.now();

    if (endTime - startTime > 1000) {
      throw new Error(`Query took too long: ${endTime - startTime}ms`);
    }
    logTest("PERFORMANCE", "Email Index Query", true);
  } catch (error) {
    logTest("PERFORMANCE", "Email Index Query", false, error);
  }

  // Test isActive index
  try {
    const startTime = Date.now();
    await prisma.member.findMany({
      where: { isActive: true },
      take: 100,
    });
    const endTime = Date.now();

    if (endTime - startTime > 1000) {
      throw new Error(`Query took too long: ${endTime - startTime}ms`);
    }
    logTest("PERFORMANCE", "isActive Index Query", true);
  } catch (error) {
    logTest("PERFORMANCE", "isActive Index Query", false, error);
  }
}

// CONSTRAINT TESTS
async function testConstraints() {
  console.log("\n🧪 Testing Database Constraints");

  // Test unique email constraint
  try {
    await prisma.member.create({
      data: {
        firstName: "Test",
        lastName: "User1",
        gender: "Male",
        dateOfBirth: new Date("1990-01-01"),
        email: "constraint.test@example.com",
        number: "1234567890",
      },
    });

    // This should fail due to unique constraint
    await prisma.member.create({
      data: {
        firstName: "Test",
        lastName: "User2",
        gender: "Female",
        dateOfBirth: new Date("1990-01-01"),
        email: "constraint.test@example.com", // Duplicate email
        number: "0987654321",
      },
    });

    logTest("CONSTRAINT", "Unique Email", false, "Should have failed");
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      logTest("CONSTRAINT", "Unique Email", true);
    } else {
      logTest("CONSTRAINT", "Unique Email", false, error);
    }
  }

  // Cleanup
  try {
    await prisma.member.deleteMany({
      where: { email: "constraint.test@example.com" },
    });
  } catch (error) {
    console.log("Cleanup error:", error);
  }
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting Comprehensive CRUD Tests for Prisma\n");
  console.log("=".repeat(60));

  // Run all test suites
  await testMembershipCRUD();
  await testServiceCRUD();
  await testMemberCRUD();
  await testInstructorCRUD();
  await testMemberRegistrationCRUD();
  await testAdminCRUD();
  await testActivityLogCRUD();
  await testBatchOperations();
  await testTransactions();
  await testComplexRelationships();
  await testIndexPerformance();
  await testConstraints();

  // Print final results
  console.log("\n" + "=".repeat(60));
  console.log("🏁 Test Results Summary");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(
    `📈 Success Rate: ${(
      (testResults.passed / (testResults.passed + testResults.failed)) *
      100
    ).toFixed(2)}%`
  );

  if (testResults.errors.length > 0) {
    console.log("\n🔍 Failed Tests Details:");
    testResults.errors.forEach((error) => console.log(error));
  }

  console.log("\n🎉 CRUD Testing Completed!");
}

// Execute the tests
runAllTests()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(testResults.failed > 0 ? 1 : 0);
  })
  .catch(async (e) => {
    console.error("💥 Fatal error during testing:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
