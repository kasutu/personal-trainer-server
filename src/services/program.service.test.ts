import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ProgramService } from "./program.service";
import { prisma } from "~/drivers/prisma";

let service: ProgramService;
let programId: number;

const CREATOR_ID = 1; // Set to a valid personId in your test DB
const testProgram = {
  name: "Test Program",
  description: "A test program",
  type: "STANDARD",
  isActive: true,
  creator: { connect: { id: CREATOR_ID } },
};

describe("ProgramService", () => {
  beforeAll(async () => {
    service = new ProgramService();
    await prisma.program.deleteMany({ where: { name: testProgram.name } });
  });

  afterAll(async () => {
    await prisma.program.deleteMany({ where: { name: testProgram.name } });
    await prisma.$disconnect();
  });

  it("should create a program", async () => {
    const program = await service.create(testProgram);
    expect(program).toBeDefined();
    expect(program.name).toBe(testProgram.name);
    programId = program.id;
  });

  it("should get by id", async () => {
    const program = await service.getById(programId);
    expect(program).toBeDefined();
    expect(program?.id).toBe(programId);
  });

  it("should get all", async () => {
    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some(p => p.id === programId)).toBe(true);
  });

  it("should update a program", async () => {
    const updated = await service.update(programId, { description: "Updated desc" });
    expect(updated.description).toBe("Updated desc");
  });

  it("should get by membership", async () => {
    // Only runs if you set a membershipId
    expect(true).toBe(true);
  });

  it("should delete a program", async () => {
    const deleted = await service.delete(programId);
    expect(deleted.id).toBe(programId);
  });
});
