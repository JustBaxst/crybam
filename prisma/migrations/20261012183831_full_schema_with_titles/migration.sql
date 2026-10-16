/*
  Warnings:

  - You are about to drop the column `cryTag` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `impression` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `originalTitle` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `platforms` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `quote` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Drama` table. All the data in the column will be lost.
  - You are about to drop the column `watchedAt` on the `Drama` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DramaTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleLower" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DramaTitle_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserDramaEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "dramaId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "rating" REAL,
    "cryTag" TEXT,
    "impression" TEXT,
    "review" TEXT,
    "quote" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "progress" INTEGER,
    "rewatchCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "watchedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserDramaEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserDramaEntry_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameNative" TEXT,
    "photoUrl" TEXT,
    "birthDate" DATETIME,
    "agency" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "dramaId" INTEGER NOT NULL,
    "roleType" TEXT NOT NULL,
    "characterId" INTEGER,
    "order" INTEGER,
    "note" TEXT,
    CONSTRAINT "Credit_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Credit_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Credit_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "relation" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "CharacterRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DramaGenre" (
    "dramaId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "genreId"),
    CONSTRAINT "DramaGenre_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DramaTag" (
    "dramaId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "tagId"),
    CONSTRAINT "DramaTag_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DramaPlatform" (
    "dramaId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "platformId"),
    CONSTRAINT "DramaPlatform_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaPlatform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Studio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT
);

-- CreateTable
CREATE TABLE "DramaStudio" (
    "dramaId" INTEGER NOT NULL,
    "studioId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "studioId"),
    CONSTRAINT "DramaStudio_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaStudio_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nomination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Nomination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NominationEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nominationId" INTEGER NOT NULL,
    "dramaId" INTEGER,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    CONSTRAINT "NominationEntry_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "Nomination" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NominationEntry_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SoundtrackLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "url" TEXT NOT NULL,
    "kind" TEXT,
    "note" TEXT,
    CONSTRAINT "SoundtrackLink_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavoriteActor" (
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "note" TEXT,
    "order" INTEGER,

    PRIMARY KEY ("userId", "personId"),
    CONSTRAINT "UserFavoriteActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFavoriteActor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavoriteCharacter" (
    "userId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    "note" TEXT,
    "order" INTEGER,

    PRIMARY KEY ("userId", "characterId"),
    CONSTRAINT "UserFavoriteCharacter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFavoriteCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfileSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "takenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "ProfileSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "country" TEXT,
    "episodes" INTEGER,
    "seasons" INTEGER,
    "episodeDuration" INTEGER,
    "synopsis" TEXT,
    "posterUrl" TEXT,
    "airStatus" TEXT NOT NULL DEFAULT 'released',
    "curatorCryTag" TEXT,
    "airedFrom" DATETIME,
    "airedTo" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Drama" ("country", "createdAt", "episodes", "id", "seasons", "title", "updatedAt", "year") SELECT "country", "createdAt", "episodes", "id", "seasons", "title", "updatedAt", "year" FROM "Drama";
DROP TABLE "Drama";
ALTER TABLE "new_Drama" RENAME TO "Drama";
CREATE INDEX "Drama_year_idx" ON "Drama"("year");
CREATE INDEX "Drama_country_idx" ON "Drama"("country");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DramaTitle_titleLower_idx" ON "DramaTitle"("titleLower");

-- CreateIndex
CREATE INDEX "DramaTitle_dramaId_idx" ON "DramaTitle"("dramaId");

-- CreateIndex
CREATE INDEX "UserDramaEntry_userId_status_idx" ON "UserDramaEntry"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserDramaEntry_userId_dramaId_key" ON "UserDramaEntry"("userId", "dramaId");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Credit_dramaId_roleType_idx" ON "Credit"("dramaId", "roleType");

-- CreateIndex
CREATE INDEX "Credit_personId_idx" ON "Credit"("personId");

-- CreateIndex
CREATE INDEX "Character_dramaId_idx" ON "Character"("dramaId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterRelation_fromId_toId_relation_key" ON "CharacterRelation"("fromId", "toId", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "Tag"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Studio_name_key" ON "Studio"("name");

-- CreateIndex
CREATE INDEX "NominationEntry_nominationId_idx" ON "NominationEntry"("nominationId");

-- CreateIndex
CREATE INDEX "SoundtrackLink_dramaId_idx" ON "SoundtrackLink"("dramaId");

-- CreateIndex
CREATE INDEX "ProfileSnapshot_userId_takenAt_idx" ON "ProfileSnapshot"("userId", "takenAt");
