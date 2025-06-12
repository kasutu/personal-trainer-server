-- CreateTable
CREATE TABLE "users"."space_provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "space_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."space_seekers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "space_seekers_pkey" PRIMARY KEY ("id")
);
