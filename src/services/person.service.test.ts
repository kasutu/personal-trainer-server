import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { PersonService } from "./person.service";
import { prisma } from "~/drivers/prisma";

let personService: PersonService;
let personId: number;

const testPerson = {
  firstName: "Test",
  lastName: "Person",
  gender: "Other",
  dateOfBirth: new Date("1990-01-01"),
};

describe("PersonService", () => {
  beforeAll(async () => {
    personService = new PersonService();
    await prisma.person.deleteMany({ where: { firstName: testPerson.firstName, lastName: testPerson.lastName } });
  });

  afterAll(async () => {
    await prisma.person.deleteMany({ where: { firstName: testPerson.firstName, lastName: testPerson.lastName } });
    await prisma.$disconnect();
  });

  it("should create a person", async () => {
    const person = await personService.create(testPerson);
    expect(person).toBeDefined();
    expect(person.firstName).toBe(testPerson.firstName);
    personId = person.id;
  });

  it("should get person by id", async () => {
    const person = await personService.getById(personId);
    expect(person).toBeDefined();
    expect(person?.firstName).toBe(testPerson.firstName);
  });

  it("should get all persons", async () => {
    const persons = await personService.getAll();
    expect(Array.isArray(persons)).toBe(true);
    expect(persons.some(p => p.id === personId)).toBe(true);
  });

  it("should update a person", async () => {
    const updated = await personService.update(personId, { lastName: "Updated" });
    expect(updated.lastName).toBe("Updated");
  });

  it("should search persons", async () => {
    const results = await personService.search("Test");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.id === personId)).toBe(true);
  });

  it("should delete a person", async () => {
    const deleted = await personService.delete(personId);
    expect(deleted.id).toBe(personId);
  });
});
