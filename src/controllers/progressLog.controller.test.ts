import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ProgressLogController } from "./progressLog.controller";
import { prisma } from "../drivers/prisma";
import { PersonService } from "../services/person.service";
import { ProgramService } from "../services/program.service";
import { EnrollmentService } from "../services/enrollment.service";

let controller: ProgressLogController;
let personId: number;
let programId: number;
let enrollmentId: number;
let progressLogId: number;

function makeReqRes(body: any = {}, params: any = {}) {
  const req = { body, params };
  let statusCode = 0;
  let jsonData: any = undefined;
  const res = {
    status(code: number) { statusCode = code; return res; },
    json(data: any) { jsonData = data; return res; },
    get data() { return jsonData; },
    get statusValue() { return statusCode; }
  };
  const next = (err?: any) => { if (err) throw err; };
  return { req, res, next };
}

describe("ProgressLogController Integration", () => {
  beforeAll(async () => {
    controller = new ProgressLogController();
    // Create test person, program, enrollment
    const person = await new PersonService().create({
      firstName: "ProgressLogTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    const program = await new ProgramService().create({
      creator: { connect: { id: personId } },
      name: "ProgressLogTest Program",
      description: "A test program for progress log",
      type: "STANDARD",
      isActive: true,
    });
    programId = program.id;
    const enrollment = await new EnrollmentService().create({
      person: { connect: { id: personId } },
      program: { connect: { id: programId } },
      goals: "Test goals",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
    });
    enrollmentId = enrollment.id;
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
    const { req, res, next } = makeReqRes({
      progress: "Initial progress",
      person: { connect: { id: personId } },
      enrollment: { connect: { id: enrollmentId } },
    });
    await controller.create(req as any, res as any, next);
    expect(res.statusValue).not.toBe(400);
    const log = res.data;
    expect(log.personId).toBe(personId);
    progressLogId = log.id;
  });

  it("should get all progress logs", async () => {
    const { req, res, next } = makeReqRes();
    await controller.getAll(req as any, res as any, next);
    const all = res.data;
    expect(Array.isArray(all)).toBe(true);
    expect(all.some((l: any) => l.id === progressLogId)).toBe(true);
  });

  it("should get progress log by id", async () => {
    const { req, res, next } = makeReqRes({}, { id: progressLogId.toString() });
    await controller.getById(req as any, res as any, next);
    const log = res.data;
    expect(log.id).toBe(progressLogId);
  });

  it("should update a progress log", async () => {
    const { req, res, next } = makeReqRes({ progress: "Updated progress" }, { id: progressLogId.toString() });
    await controller.update(req as any, res as any, next);
    const updated = res.data;
    expect(updated.progress).toBe("Updated progress");
  });

  it("should get by person", async () => {
    const { req, res, next } = makeReqRes({}, { personId: personId.toString() });
    await controller.getByPerson(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.some((l: any) => l.id === progressLogId)).toBe(true);
  });

  it("should get by enrollment", async () => {
    const { req, res, next } = makeReqRes({}, { enrollmentId: enrollmentId.toString() });
    await controller.getByEnrollment(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.some((l: any) => l.id === progressLogId)).toBe(true);
  });

  it("should delete a progress log", async () => {
    const { req, res, next } = makeReqRes({}, { id: progressLogId.toString() });
    await controller.delete(req as any, res as any, next);
    const deleted = res.data;
    expect(deleted.id).toBe(progressLogId);
  });
});
