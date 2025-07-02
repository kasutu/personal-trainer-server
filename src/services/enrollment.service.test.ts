import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { EnrollmentService } from "./enrollment.service";
import { prisma } from "~/drivers/prisma";

let service: EnrollmentService;
let enrollmentId: number;

const PERSON_ID = 1; // Set to a valid personId in your test DB
const PROGRAM_ID = 1; // Set to a valid programId in your test DB
const testEnrollment = {
  goals: "Test goals",
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-12-31"),
  isActive: true,
  person: { connect: { id: PERSON_ID } },
  program: { connect: { id: PROGRAM_ID } },
};

describe("EnrollmentService", () => {
  beforeAll(async () => {
    service = new EnrollmentService();
    await prisma.enrollment.deleteMany({ where: { personId: PERSON_ID, programId: PROGRAM_ID } });
  });

  afterAll(async () => {
    await prisma.enrollment.deleteMany({ where: { personId: PERSON_ID, programId: PROGRAM_ID } });
    await prisma.$disconnect();
  });

  it("should create an enrollment", async () => {
    const enrollment = await service.create(testEnrollment);
    expect(enrollment).toBeDefined();
    expect(enrollment.personId).toBe(PERSON_ID);
    enrollmentId = enrollment.id;
  });

  it("should get by id", async () => {
    const enrollment = await service.getById(enrollmentId);
    expect(enrollment).toBeDefined();
    expect(enrollment?.id).toBe(enrollmentId);
  });

  it("should get all", async () => {
    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some((e) => e.id === enrollmentId)).toBe(true);
  });

  it("should update an enrollment", async () => {
    const updated = await service.update(enrollmentId, {
      goals: "Updated goals",
    });
    expect(updated.goals).toBe("Updated goals");
  });

  it("should get by person", async () => {
    const enrollments = await service.getByPerson(PERSON_ID);
    expect(enrollments.some((e) => e.id === enrollmentId)).toBe(true);
  });

  it("should get by program", async () => {
    const enrollments = await service.getByProgram(PROGRAM_ID);
    expect(enrollments.some((e) => e.id === enrollmentId)).toBe(true);
  });

  it("should delete an enrollment", async () => {
    const deleted = await service.delete(enrollmentId);
    expect(deleted.id).toBe(enrollmentId);
  });
});
