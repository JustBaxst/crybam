-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "dramaId" INTEGER NOT NULL,
    "roleType" TEXT NOT NULL,
    "importance" TEXT NOT NULL DEFAULT 'support',
    "characterId" INTEGER,
    "order" INTEGER,
    "note" TEXT,
    CONSTRAINT "Credit_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Credit_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Credit_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("characterId", "dramaId", "id", "note", "order", "personId", "roleType") SELECT "characterId", "dramaId", "id", "note", "order", "personId", "roleType" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE INDEX "Credit_dramaId_roleType_idx" ON "Credit"("dramaId", "roleType");
CREATE INDEX "Credit_personId_idx" ON "Credit"("personId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
