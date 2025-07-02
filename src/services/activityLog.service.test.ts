import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ActivityLogService } from "./activityLog.service";
import { prisma } from "~/drivers/prisma";

let service: ActivityLogService;
let logId: number;

const PERSON_ID = 1; // Set to a valid personId in your test DB
const testLog = {
  activityType: "WORKOUT",
  activityName: "Test Activity",
  person: { connect: { id: PERSON_ID } },
};

describe("ActivityLogService", () => {
  beforeAll(async () => {
    service = new ActivityLogService();
    await prisma.activityLog.deleteMany({
      where: {
        personId: PERSON_ID,
        activityName: testLog.activityName,
      },
    });
  });

  afterAll(async () => {
    await prisma.activityLog.deleteMany({
      where: {
        personId: PERSON_ID,
        activityName: testLog.activityName,
      },
    });
    await prisma.$disconnect();
  });

  it("should create an activity log", async () => {
    const log = await service.create(testLog);
    expect(log).toBeDefined();
    expect(log.personId).toBe(PERSON_ID);
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
    expect(all.some((l) => l.id === logId)).toBe(true);
  });

  it("should update a log", async () => {
    const updated = await service.update(logId, {
      description: "Updated desc",
    });
    expect(updated.description).toBe("Updated desc");
  });

  it("should get by person", async () => {
    const logs = await service.getByPerson(PERSON_ID);
    expect(logs.some((l) => l.id === logId)).toBe(true);
  });

  it("should delete a log", async () => {
    const deleted = await service.delete(logId);
    expect(deleted.id).toBe(logId);
  });
});
