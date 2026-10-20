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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("createdAt", "description", "dramaId", "id", "imageUrl", "name") SELECT "createdAt", "description", "dramaId", "id", "imageUrl", "name" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE INDEX "Character_dramaId_idx" ON "Character"("dramaId");
CREATE INDEX "Character_nameLower_idx" ON "Character"("nameLower");
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameNative" TEXT,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT,
    "birthDate" DATETIME,
    "agency" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Person" ("agency", "bio", "birthDate", "createdAt", "id", "name", "nameNative", "photoUrl") SELECT "agency", "bio", "birthDate", "createdAt", "id", "name", "nameNative", "photoUrl" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE INDEX "Person_name_idx" ON "Person"("name");
CREATE INDEX "Person_nameLower_idx" ON "Person"("nameLower");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
