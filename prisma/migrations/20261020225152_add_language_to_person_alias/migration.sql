-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PersonAlias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonAlias_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PersonAlias" ("createdAt", "id", "name", "nameLower", "personId") SELECT "createdAt", "id", "name", "nameLower", "personId" FROM "PersonAlias";
DROP TABLE "PersonAlias";
ALTER TABLE "new_PersonAlias" RENAME TO "PersonAlias";
CREATE INDEX "PersonAlias_personId_idx" ON "PersonAlias"("personId");
CREATE INDEX "PersonAlias_nameLower_idx" ON "PersonAlias"("nameLower");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
