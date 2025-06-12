import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Create a random space according to the schema
function createRandomSpace() {
  return {
    name: faker.lorem.word(),
    type: faker.helpers.arrayElement([
      "office",
      "lobby",
      "conference",
      "restroom",
    ]),
  };
}

// Create a random building with associated spaces
function createRandomBuildingData() {
  const spacesCount = faker.number.int({ min: 1, max: 5 });
  const spacesData = Array.from({ length: spacesCount }, () =>
    createRandomSpace()
  );
  return {
    name: faker.company.name(),
    spaces: { create: spacesData },
  };
}

// Seed buildings (and related spaces) based on our Prisma schema
async function seedBuildings() {
  const buildings = await Promise.all(
    Array.from({ length: 10 }, async () => {
      return prisma.building.create({ data: createRandomBuildingData() });
    })
  );
  return buildings;
}

// Create a random space provider
function createRandomSpaceProviderData() {
  return {
    name: faker.company.name(),
  };
}

// Seed space providers based on our Prisma schema
async function seedSpaceProviders() {
  const providers = await Promise.all(
    Array.from({ length: 5 }, async () => {
      return prisma.spaceProvider.create({
        data: createRandomSpaceProviderData(),
      });
    })
  );
  return providers;
}

// Create a random space seeker
function createRandomSpaceSeekerData() {
  return {
    name: faker.person.fullName(),
  };
}

// Seed space seekers based on our Prisma schema
async function seedSpaceSeekers() {
  const seekers = await Promise.all(
    Array.from({ length: 5 }, async () => {
      return prisma.spaceSeeker.create({
        data: createRandomSpaceSeekerData(),
      });
    })
  );
  return seekers;
}

async function main() {
  // Clean the database first using a transaction for safety
  await prisma.$transaction([
    prisma.space.deleteMany({}),
    prisma.building.deleteMany({}),
    prisma.spaceProvider.deleteMany({}),
    prisma.spaceSeeker.deleteMany({}),
  ]);

  const buildings = await seedBuildings();
  const providers = await seedSpaceProviders();
  const seekers = await seedSpaceSeekers();

  console.log(`Created ${buildings.length} buildings with random spaces`);
  console.log(`Created ${providers.length} space providers`);
  console.log(`Created ${seekers.length} space seekers`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
