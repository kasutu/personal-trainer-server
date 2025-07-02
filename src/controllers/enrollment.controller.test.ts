import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { EnrollmentController } from "./enrollment.controller";
import { PersonService } from "../services/person.service";
import { ProgramService } from "../services/program.service";
import { prisma } from "../drivers/prisma";

let controller: EnrollmentController;
let personService: PersonService;
let programService: ProgramService;
let personId: number;
let programId: number;
let enrollmentId: number;

function makeReqRes(body: any = {}, params: any = {}) {
  const req = { body, params };
  let statusCode = 0;
  let jsonData: any = undefined;
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: any) {
      jsonData = data;
      return res;
    },
    get data() {
      return jsonData;
    },
    get statusCode() {
      return statusCode;
    },
  };
  const next = (err?: any) => {
    if (err) throw err;
  };
  return { req, res, next };
}

describe("EnrollmentController Integration", () => {
  beforeAll(async () => {
    controller = new EnrollmentController();
    personService = new PersonService();
    programService = new ProgramService();
    // Create a test person
    const person = await personService.create({
      firstName: "EnrollTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    // Create a test program
    const program = await programService.create({
      creator: { connect: { id: personId } },
      name: "EnrollTest Program",
      description: "A test program for enrollment",
      type: "STANDARD",
      isActive: true,
    });
    programId = program.id;
    await prisma.enrollment.deleteMany({ where: { personId, programId } });
  });

  afterAll(async () => {
    if (enrollmentId)
      await prisma.enrollment.delete({ where: { id: enrollmentId } });
    await programService.delete(programId);
    await personService.delete(personId);
    await prisma.$disconnect();
  });

  it("should create an enrollment", async () => {
    const { req, res, next } = makeReqRes({
      person: { connect: { id: personId } },
      program: { connect: { id: programId } },
      goals: "Test goals",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
    });
    await controller.create(req as any, res as any, next);
    expect(res.statusCode).not.toBe(400);
    const created = res.data;
    expect(created.personId).toBe(personId);
    expect(created.programId).toBe(programId);
    enrollmentId = created.id;
  });

  it("should get all enrollments", async () => {
    const { req, res, next } = makeReqRes();
    await controller.getAll(req as any, res as any, next);
    const all = res.data;
    expect(Array.isArray(all)).toBe(true);
    expect(all.find((e: any) => e.id === enrollmentId)).toBeTruthy();
  });

  it("should get enrollment by id", async () => {
    const { req, res, next } = makeReqRes({}, { id: enrollmentId.toString() });
    await controller.getById(req as any, res as any, next);
    const found = res.data;
    expect(found.id).toBe(enrollmentId);
  });

  it("should update an enrollment", async () => {
    const { req, res, next } = makeReqRes(
      { goals: "Updated goals" },
      { id: enrollmentId.toString() }
    );
    await controller.update(req as any, res as any, next);
    const updated = res.data;
    expect(updated.goals).toBe("Updated goals");
  });

  it("should get enrollments by person", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { personId: personId.toString() }
    );
    await controller.getByPerson(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.find((e: any) => e.id === enrollmentId)).toBeTruthy();
  });

  it("should get enrollments by program", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { programId: programId.toString() }
    );
    await controller.getByProgram(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.find((e: any) => e.id === enrollmentId)).toBeTruthy();
  });

  it("should delete an enrollment", async () => {
    const { req, res, next } = makeReqRes({}, { id: enrollmentId.toString() });
    await controller.delete(req as any, res as any, next);
    const deleted = res.data;
    expect(deleted.id).toBe(enrollmentId);
    enrollmentId = undefined as any;
  });
});
