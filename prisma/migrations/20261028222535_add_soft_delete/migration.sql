-- AlterTable
ALTER TABLE "Character" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Drama" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN "deletedAt" DATETIME;
