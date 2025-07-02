import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { PersonService } from "../services/person.service";

let personService: PersonService;
let createdId: number;

describe("PersonService Integration", () => {
  beforeAll(() => {
    personService = new PersonService();
  });

  afterAll(async () => {
    if (createdId) {
      await personService.delete(createdId);
    }
    const { prisma } = await import("~/drivers/prisma");
    await prisma.$disconnect();
  });

  it("should create a person", async () => {
    const person = await personService.create({
      firstName: "PersonTest",
      lastName: "User",
      gender: "Other",
      dateOfBirth: new Date("1990-01-01"),
    });
    expect(person.firstName).toBe("PersonTest");
    createdId = person.id;
  });

  it("should get all persons", async () => {
    const persons = await personService.getAll();
    expect(Array.isArray(persons)).toBe(true);
    expect(persons.find((p) => p.id === createdId)).toBeTruthy();
  });

  it("should get person by id", async () => {
    const person = await personService.getById(createdId);
    expect(person).toBeTruthy();
    expect(person?.id).toBe(createdId);
  });

  it("should update a person", async () => {
    const updated = await personService.update(createdId, { lastName: "Updated" });
    expect(updated.lastName).toBe("Updated");
  });

  it("should search persons", async () => {
    const results = await personService.search("PersonTest");
    expect(Array.isArray(results)).toBe(true);
    expect(results.find((p) => p.id === createdId)).toBeTruthy();
  });

  it("should delete a person", async () => {
    const deleted = await personService.delete(createdId);
    expect(deleted.id).toBe(createdId);
    createdId = undefined as any;
  });
});
