import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { MembershipController } from "./membership.controller";
import { prisma } from "../drivers/prisma";

let controller: MembershipController;
let membershipId: number;

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

describe("MembershipController Integration", () => {
  beforeAll(async () => {
    controller = new MembershipController();
    await prisma.membership.deleteMany({ where: { name: "MembershipTest" } });
  });

  afterAll(async () => {
    if (membershipId)
      await prisma.membership.delete({ where: { id: membershipId } });
    await prisma.$disconnect();
  });

  it("should create a membership", async () => {
    const { req, res, next } = makeReqRes({
      name: "MembershipTest",
      description: "A test membership",
    });
    await controller.create(req as any, res as any, next);
    expect(res.statusCode).not.toBe(400);
    const created = res.data;
    expect(created.name).toBe("MembershipTest");
    membershipId = created.id;
  });

  it("should get all memberships", async () => {
    const { req, res, next } = makeReqRes();
    await controller.getAll(req as any, res as any, next);
    const all = res.data;
    expect(Array.isArray(all)).toBe(true);
    expect(all.some((m: any) => m.id === membershipId)).toBe(true);
  });

  it("should get membership by id", async () => {
    const { req, res, next } = makeReqRes({}, { id: membershipId.toString() });
    await controller.getById(req as any, res as any, next);
    const found = res.data;
    expect(found.id).toBe(membershipId);
  });

  it("should update a membership", async () => {
    const { req, res, next } = makeReqRes(
      { description: "Updated desc" },
      { id: membershipId.toString() }
    );
    await controller.update(req as any, res as any, next);
    const updated = res.data;
    expect(updated.description).toBe("Updated desc");
  });

  it("should delete a membership", async () => {
    const { req, res, next } = makeReqRes({}, { id: membershipId.toString() });
    await controller.delete(req as any, res as any, next);
    const deleted = res.data;
    expect(deleted.id).toBe(membershipId);
    membershipId = undefined as any;
  });
});
