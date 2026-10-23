-- AlterTable
ALTER TABLE "Character" ADD COLUMN "age" TEXT;
ALTER TABLE "Character" ADD COLUMN "birthDate" TEXT;
ALTER TABLE "Character" ADD COLUMN "gender" TEXT;
ALTER TABLE "Character" ADD COLUMN "height" TEXT;
ALTER TABLE "Character" ADD COLUMN "occupation" TEXT;
ALTER TABLE "Character" ADD COLUMN "zodiacChinese" TEXT;
ALTER TABLE "Character" ADD COLUMN "zodiacWestern" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN "birthPlace" TEXT;
ALTER TABLE "Person" ADD COLUMN "gender" TEXT;
ALTER TABLE "Person" ADD COLUMN "height" INTEGER;

-- CreateTable
CREATE TABLE "PersonSocialLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "handle" TEXT,
    CONSTRAINT "PersonSocialLink_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterAlias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CharacterAlias_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "relationType" TEXT NOT NULL DEFAULT 'family',
    "relation" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "CharacterRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CharacterRelation" ("fromId", "id", "note", "relation", "toId") SELECT "fromId", "id", "note", "relation", "toId" FROM "CharacterRelation";
DROP TABLE "CharacterRelation";
ALTER TABLE "new_CharacterRelation" RENAME TO "CharacterRelation";
CREATE UNIQUE INDEX "CharacterRelation_fromId_toId_relation_key" ON "CharacterRelation"("fromId", "toId", "relation");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PersonSocialLink_personId_idx" ON "PersonSocialLink"("personId");

-- CreateIndex
CREATE INDEX "CharacterAlias_characterId_idx" ON "CharacterAlias"("characterId");

-- CreateIndex
CREATE INDEX "CharacterAlias_nameLower_idx" ON "CharacterAlias"("nameLower");
