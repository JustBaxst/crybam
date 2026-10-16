-- AlterTable
ALTER TABLE "SoundtrackLink" ADD COLUMN "coverUrl" TEXT;
ALTER TABLE "SoundtrackLink" ADD COLUMN "durationSec" INTEGER;
ALTER TABLE "SoundtrackLink" ADD COLUMN "embedId" TEXT;
ALTER TABLE "SoundtrackLink" ADD COLUMN "provider" TEXT;

-- CreateTable
CREATE TABLE "ViewerTasteItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confidence" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedAt" DATETIME,
    "order" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ViewerTasteItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TasteEvidence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tasteItemId" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,
    "quote" TEXT,
    "weight" REAL,
    CONSTRAINT "TasteEvidence_tasteItemId_fkey" FOREIGN KEY ("tasteItemId") REFERENCES "ViewerTasteItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TasteEvidence_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "UserDramaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NominationEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nominationId" INTEGER NOT NULL,
    "dramaId" INTEGER,
    "personId" INTEGER,
    "characterId" INTEGER,
    "soundtrackId" INTEGER,
    "contextNote" TEXT,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    CONSTRAINT "NominationEntry_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "Nomination" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NominationEntry_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NominationEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NominationEntry_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NominationEntry_soundtrackId_fkey" FOREIGN KEY ("soundtrackId") REFERENCES "SoundtrackLink" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NominationEntry" ("dramaId", "id", "isWinner", "nominationId", "note") SELECT "dramaId", "id", "isWinner", "nominationId", "note" FROM "NominationEntry";
DROP TABLE "NominationEntry";
ALTER TABLE "new_NominationEntry" RENAME TO "NominationEntry";
CREATE INDEX "NominationEntry_nominationId_idx" ON "NominationEntry"("nominationId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "lastPortraitBuild" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ViewerTasteItem_userId_kind_isActive_idx" ON "ViewerTasteItem"("userId", "kind", "isActive");

-- CreateIndex
CREATE INDEX "TasteEvidence_tasteItemId_idx" ON "TasteEvidence"("tasteItemId");
