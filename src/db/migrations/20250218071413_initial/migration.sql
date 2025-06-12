-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bridge";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "system";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "transactional";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateTable
CREATE TABLE "public"."building" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,
    "buildingId" TEXT,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."space" ADD CONSTRAINT "space_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "public"."building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
