/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `building` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `space` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `space_provider` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `space_seekers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."building" DROP COLUMN "deleted_at",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."space" DROP COLUMN "deleted_at",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users"."space_provider" DROP COLUMN "deleted_at",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users"."space_seekers" DROP COLUMN "deleted_at",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
