/*
  Warnings:

  - You are about to drop the column `zodiacChinese` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacWestern` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN "bloodType" TEXT;
ALTER TABLE "Person" ADD COLUMN "mbti" TEXT;
ALTER TABLE "Person" ADD COLUMN "zodiacChinese" TEXT;
ALTER TABLE "Person" ADD COLUMN "zodiacWestern" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "imageUrl" TEXT,
    "gender" TEXT,
    "height" TEXT,
    "age" TEXT,
    "birthDate" TEXT,
    "occupation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("age", "birthDate", "createdAt", "description", "dramaId", "gender", "height", "id", "imageUrl", "name", "nameLower", "occupation") SELECT "age", "birthDate", "createdAt", "description", "dramaId", "gender", "height", "id", "imageUrl", "name", "nameLower", "occupation" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE INDEX "Character_dramaId_idx" ON "Character"("dramaId");
CREATE INDEX "Character_nameLower_idx" ON "Character"("nameLower");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
