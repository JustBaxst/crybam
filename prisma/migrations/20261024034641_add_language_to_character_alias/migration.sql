-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterAlias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CharacterAlias_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CharacterAlias" ("characterId", "createdAt", "id", "name", "nameLower") SELECT "characterId", "createdAt", "id", "name", "nameLower" FROM "CharacterAlias";
DROP TABLE "CharacterAlias";
ALTER TABLE "new_CharacterAlias" RENAME TO "CharacterAlias";
CREATE INDEX "CharacterAlias_characterId_idx" ON "CharacterAlias"("characterId");
CREATE INDEX "CharacterAlias_nameLower_idx" ON "CharacterAlias"("nameLower");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
