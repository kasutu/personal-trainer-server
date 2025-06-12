import { PrismaClient } from "@prisma/client";
import { logger } from "~/utils/logger";

// use `prisma` in your application to read and write data in your DB
export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query", (e) => {
  logger.info(
    `Prisma >> Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`
  );
});

prisma.$on("error", (e) => {
  logger.error(`Prisma >> ${e.message}`);
});

prisma.$on("warn", (e) => {
  logger.warn(`Prisma >> ${e.message}`);
});

prisma.$on("info", (e) => {
  logger.info(`Prisma >> ${e.message}`);
});
