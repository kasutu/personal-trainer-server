import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { ActivityLogService } from "../services/activityLog.service";
import { PersonService } from "../services/person.service";
import { prisma } from "../drivers/prisma";

let service: ActivityLogService;
let personService: PersonService;
let logId: number;
let personId: number;

describe("ActivityLogService Integration", () => {
  beforeAll(async () => {
    service = new ActivityLogService();
    personService = new PersonService();
    // Create a test person
    const person = await personService.create({
      firstName: "ActivityLogTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    // Clean up any logs for this person
    await prisma.activityLog.deleteMany({ where: { personId } });
  });

  afterAll(async () => {
    await prisma.activityLog.deleteMany({ where: { personId } });
    await prisma.person.delete({ where: { id: personId } });
    await prisma.$disconnect();
  });

  it("should create an activity log", async () => {
    const log = await service.create({
      person: { connect: { id: personId } },
      activityType: "WORKOUT",
      activityName: "Test Activity",
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
    expect(all.some((l) => l.id === logId)).toBe(true);
  });

  it("should update a log", async () => {
    const updated = await service.update(logId, {
      description: "Updated desc",
    });
    expect(updated.description).toBe("Updated desc");
  });

  it("should get by person", async () => {
    const logs = await service.getByPerson(personId);
    expect(logs.some((l) => l.id === logId)).toBe(true);
  });

  it("should delete a log", async () => {
    const deleted = await service.delete(logId);
    expect(deleted.id).toBe(logId);
  });
});
