import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

/**
 * Drops all foreign key constraints and user tables from the SQL Server database (no prompt), then pushes the empty schema
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    // Drop all foreign key constraints in dbo schema
    const constraints: Array<{ table_name: string; constraint_name: string }> = await prisma.$queryRawUnsafe(
      `
      SELECT tc.TABLE_NAME as table_name, tc.CONSTRAINT_NAME as constraint_name
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
      WHERE tc.CONSTRAINT_TYPE = 'FOREIGN KEY' AND tc.TABLE_SCHEMA = 'dbo'
      `
    );
    for (const { table_name, constraint_name } of constraints) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE [dbo].[${table_name}] DROP CONSTRAINT [${constraint_name}]`
      );
      console.log(`Dropped FK constraint: ${constraint_name} on table: ${table_name}`);
    }

    // Get all user table names in the current schema except for _prisma_migrations
    const tables: Array<{ table_name: string }> = await prisma.$queryRawUnsafe(
      `
      SELECT TABLE_NAME as table_name
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_SCHEMA = 'dbo'
      AND TABLE_NAME != '_prisma_migrations'
      `
    );

    // Drop each table
    for (const { table_name } of tables) {
      await prisma.$executeRawUnsafe(
        `DROP TABLE [dbo].[${table_name}]`
      );
      console.log(`Dropped table: ${table_name}`);
    }

    console.log("Database nuked successfully. Pushing empty schema...");
  } catch (error) {
    console.error("Failed to nuke database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    try {
      execSync("bunx prisma db push", { stdio: "inherit" });
      console.log("Empty schema pushed successfully.");
    } catch (pushErr) {
      console.error("Failed to push empty schema:", pushErr);
      process.exit(1);
    }
    process.exit(0);
  }
}

main();
