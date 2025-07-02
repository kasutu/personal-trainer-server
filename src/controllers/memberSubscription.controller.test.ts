import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { MemberSubscriptionController } from "./memberSubscription.controller";
import { prisma } from "../drivers/prisma";
import { PersonService } from "../services/person.service";
import { MembershipService } from "../services/membership.service";

let controller: MemberSubscriptionController;
let personId: number;
let membershipId: number;
let subscriptionId: number;

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

describe("MemberSubscriptionController Integration", () => {
  beforeAll(async () => {
    controller = new MemberSubscriptionController();
    // Create test person and membership
    const person = await new PersonService().create({
      firstName: "SubTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    personId = person.id;
    const membership = await new MembershipService().create({
      name: "SubTest Membership",
      description: "A test membership",
    });
    membershipId = membership.id;
    await prisma.memberSubscription.deleteMany({
      where: { personId, membershipId },
    });
  });

  afterAll(async () => {
    await prisma.memberSubscription.deleteMany({
      where: { personId, membershipId },
    });
    await prisma.membership.delete({ where: { id: membershipId } });
    await prisma.person.delete({ where: { id: personId } });
    await prisma.$disconnect();
  });

  it("should create a member subscription", async () => {
    const { req, res, next } = makeReqRes({
      person: { connect: { id: personId } },
      membership: { connect: { id: membershipId } },
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      status: "ACTIVE",
    });
    await controller.create(req as any, res as any, next);
    expect(res.statusCode).toBe(201);
    const sub = res.data;
    expect(sub.personId).toBe(personId);
    subscriptionId = sub.id;
  });

  it("should get all subscriptions", async () => {
    const { req, res, next } = makeReqRes();
    await controller.getAll(req as any, res as any, next);
    const all = res.data;
    expect(Array.isArray(all)).toBe(true);
    expect(all.some((s: any) => s.id === subscriptionId)).toBe(true);
  });

  it("should get subscription by id", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { id: subscriptionId.toString() }
    );
    await controller.getById(req as any, res as any, next);
    const sub = res.data;
    expect(sub.id).toBe(subscriptionId);
  });

  it("should update a subscription", async () => {
    const { req, res, next } = makeReqRes(
      { status: "EXPIRED" },
      { id: subscriptionId.toString() }
    );
    await controller.update(req as any, res as any, next);
    const updated = res.data;
    expect(updated.status).toBe("EXPIRED");
  });

  it("should get by person", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { personId: personId.toString() }
    );
    await controller.getByPerson(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.some((s: any) => s.id === subscriptionId)).toBe(true);
  });

  it("should get by membership", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { membershipId: membershipId.toString() }
    );
    await controller.getByMembership(req as any, res as any, next);
    const arr = res.data;
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.some((s: any) => s.id === subscriptionId)).toBe(true);
  });

  it("should delete a subscription", async () => {
    const { req, res, next } = makeReqRes(
      {},
      { id: subscriptionId.toString() }
    );
    await controller.delete(req as any, res as any, next);
    const deleted = res.data;
    expect(deleted.id).toBe(subscriptionId);
  });
});
