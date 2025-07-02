import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { MemberSubscriptionService } from "./memberSubscription.service";
import { prisma } from "~/drivers/prisma";

let service: MemberSubscriptionService;
let subId: number;

const PERSON_ID = 1; // Set to a valid personId in your test DB
const MEMBERSHIP_ID = 1; // Set to a valid membershipId in your test DB
const testSub = {
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-12-31"),
  status: "ACTIVE",
  person: { connect: { id: PERSON_ID } },
  membership: { connect: { id: MEMBERSHIP_ID } },
};

describe("MemberSubscriptionService", () => {
  beforeAll(async () => {
    service = new MemberSubscriptionService();
    // Clean up
    await prisma.memberSubscription.deleteMany({ where: { personId: PERSON_ID, membershipId: MEMBERSHIP_ID } });
  });

  afterAll(async () => {
    await prisma.memberSubscription.deleteMany({ where: { personId: PERSON_ID, membershipId: MEMBERSHIP_ID } });
    await prisma.$disconnect();
  });

  it("should create a member subscription", async () => {
    const sub = await service.create(testSub);
    expect(sub).toBeDefined();
    expect(sub.personId).toBe(PERSON_ID);
    subId = sub.id;
  });

  it("should get by id", async () => {
    const sub = await service.getById(subId);
    expect(sub).toBeDefined();
    expect(sub?.id).toBe(subId);
  });

  it("should get all", async () => {
    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.some(s => s.id === subId)).toBe(true);
  });

  it("should update a subscription", async () => {
    const updated = await service.update(subId, { status: "EXPIRED" });
    expect(updated.status).toBe("EXPIRED");
  });

  it("should get by person", async () => {
    const subs = await service.getByPerson(PERSON_ID);
    expect(subs.some(s => s.id === subId)).toBe(true);
  });

  it("should delete a subscription", async () => {
    const deleted = await service.delete(subId);
    expect(deleted.id).toBe(subId);
  });
});
