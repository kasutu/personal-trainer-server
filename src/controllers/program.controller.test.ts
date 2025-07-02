import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ProgramController } from "./program.controller";
import { prisma } from "../drivers/prisma";
import { PersonService } from "../services/person.service";

let controller: ProgramController;
let creatorId: number;
let programId: number;

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

describe("ProgramController Integration", () => {
  beforeAll(async () => {
    controller = new ProgramController();
    // Create a test person as program creator
    const person = await new PersonService().create({
      firstName: "ProgramTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    creatorId = person.id;
    await prisma.program.deleteMany({ where: { creatorId } });
  });

  afterAll(async () => {
    await prisma.program.deleteMany({ where: { creatorId } });
    await prisma.person.delete({ where: { id: creatorId } });
    await prisma.$disconnect();
  });

  it("should create a program", async () => {
    const { req, res, next } = makeReqRes({
      creator: { connect: { id: creatorId } },
      name: "ProgramTest Program",
      description: "A test program",
      type: "STANDARD",
      isActive: true,
    });
    await controller.create(req as any, res as any, next);
    expect(res.statusCode).toBe(201);
    const program = res.data;
    expect(program.creatorId).toBe(creatorId);
    programId = program.id;
  });

  it("should get all programs", async () => {
    const { req, res, next } = makeReqRes();
    await controller.getAll(req as any, res as any, next);
    const all = res.data;
    expect(Array.isArray(all)).toBe(true);
    expect(all.some((p: any) => p.id === programId)).toBe(true);
  });

  it("should get program by id", async () => {
    const { req, res, next } = makeReqRes({}, { id: programId.toString() });
    await controller.getById(req as any, res as any, next);
    const program = res.data;
    expect(program.id).toBe(programId);
  });

  it("should update a program", async () => {
    const { req, res, next } = makeReqRes(
      { description: "Updated desc" },
      { id: programId.toString() }
    );
    await controller.update(req as any, res as any, next);
    const updated = res.data;
    expect(updated.description).toBe("Updated desc");
  });

  it("should get by membership (empty)", async () => {
    const { req, res, next } = makeReqRes({}, { membershipId: "999999" });
    await controller.getByMembership(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
  });

  it("should delete a program", async () => {
    const { req, res, next } = makeReqRes({}, { id: programId.toString() });
    await controller.delete(req as any, res as any, next);
    const deleted = res.data;
    expect(deleted.id).toBe(programId);
  });
});
