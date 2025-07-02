import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { MemberStandardPreferenceLogService } from "./memberStandardPreferenceLog.service";
import { PersonService } from "./person.service";
import { prisma } from "~/drivers/prisma";

let service: MemberStandardPreferenceLogService;
let logId: number;
let personId: number;

describe("MemberStandardPreferenceLogService", () => {
  beforeAll(async () => {
    service = new MemberStandardPreferenceLogService();
    // Create a test person
    const personService = new PersonService();
    const person = await personService.create({
      firstName: "PrefLogTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    // Clean up any logs for this person
    await prisma.memberStandardPreferenceLog.deleteMany({ where: { personId } });
  });

  afterAll(async () => {
    await prisma.memberStandardPreferenceLog.deleteMany({ where: { personId } });
    await prisma.person.delete({ where: { id: personId } });
    await prisma.$disconnect();
  });

  it("should create a preference log", async () => {
    const log = await service.create({
      goals: "Lose weight",
      recordedAvailability: "Morning 6AM-9AM",
      person: { connect: { id: personId } },
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
    const updated = await service.update(logId, { goals: "Gain muscle" });
    expect(updated.goals).toBe("Gain muscle");
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
