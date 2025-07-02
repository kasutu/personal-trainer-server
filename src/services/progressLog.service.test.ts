import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ProgressLogService } from "./progressLog.service";
import { prisma } from "~/drivers/prisma";
import { PersonService } from "./person.service";
import { EnrollmentService } from "./enrollment.service";
import { ProgramService } from "./program.service";

let service: ProgressLogService;
let logId: number;
let personId: number;
let enrollmentId: number;
let programId: number;

describe("ProgressLogService", () => {
  beforeAll(async () => {
    service = new ProgressLogService();
    // Create a test person
    const personService = new PersonService();
    const person = await personService.create({
      firstName: "ProgressLogTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    // Create a test program
    const programService = new ProgramService();
    const program = await programService.create({
      creator: { connect: { id: personId } },
      name: "ProgressLogTest Program",
      description: "A test program for progress log",
      type: "STANDARD",
      isActive: true,
    });
    programId = program.id;
    // Create a test enrollment
    const enrollmentService = new EnrollmentService();
    const enrollment = await enrollmentService.create({
      person: { connect: { id: personId } },
      program: { connect: { id: programId } },
      goals: "Test goals",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
    });
    enrollmentId = enrollment.id;
    // Clean up any progress logs for this person/enrollment
    await prisma.progressLog.deleteMany({ where: { personId, enrollmentId } });
  });

  afterAll(async () => {
    await prisma.progressLog.deleteMany({ where: { personId, enrollmentId } });
    await prisma.enrollment.delete({ where: { id: enrollmentId } });
    await prisma.program.delete({ where: { id: programId } });
    await prisma.person.delete({ where: { id: personId } });
    await prisma.$disconnect();
  });

  it("should create a progress log", async () => {
    const log = await service.create({
      progress: "Initial progress",
      person: { connect: { id: personId } },
      enrollment: { connect: { id: enrollmentId } },
    });
    expect(log).toBeDefined();
    expect(log.personId).toBe(personId);
    logId = log.id;
  });

  it("should get by id", async () => {
    const log = await service.getById(logId);
    expect(log).toBeDefined();
    expect(log?.id).toBe(logId);
  });

  it("should get all", async () => {
    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some(l => l.id === logId)).toBe(true);
  });

  it("should update a log", async () => {
    const updated = await service.update(logId, { progress: "Updated progress" });
    expect(updated.progress).toBe("Updated progress");
  });

  it("should get by person", async () => {
    const logs = await service.getByPerson(personId);
    expect(logs.some(l => l.id === logId)).toBe(true);
  });

  it("should get by enrollment", async () => {
    const logs = await service.getByEnrollment(enrollmentId);
    expect(logs.some(l => l.id === logId)).toBe(true);
  });

  it("should delete a log", async () => {
    const deleted = await service.delete(logId);
    expect(deleted.id).toBe(logId);
  });
});
