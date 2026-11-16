-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "lastPortraitBuild" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Drama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "titleLower" TEXT NOT NULL DEFAULT '',
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
    "ratingKinopoisk" REAL,
    "ratingMDL" REAL,
    "ratingIMDB" REAL,
    "ratingCrybam" REAL,
    "crybamVotes" INTEGER NOT NULL DEFAULT 0,
    "dubbingStudios" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
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
CREATE TABLE "DramaMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "order" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DramaMedia_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DramaTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DramaThemeLink" (
    "dramaId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "themeId"),
    CONSTRAINT "DramaThemeLink_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaThemeLink_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "DramaTheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DramaMoodLink" (
    "dramaId" INTEGER NOT NULL,
    "moodId" INTEGER NOT NULL,

    PRIMARY KEY ("dramaId", "moodId"),
    CONSTRAINT "DramaMoodLink_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DramaMoodLink_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameNative" TEXT,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT,
    "birthDate" DATETIME,
    "agency" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "height" INTEGER,
    "birthPlace" TEXT,
    "nationality" TEXT,
    "bloodType" TEXT,
    "mbti" TEXT,
    "zodiacWestern" TEXT,
    "zodiacChinese" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Credit" (
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

-- CreateTable
CREATE TABLE "Character" (
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
    "deletedAt" DATETIME,
    CONSTRAINT "Character_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "relationType" TEXT NOT NULL DEFAULT 'family',
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

-- CreateTable
CREATE TABLE "SoundtrackLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dramaId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "url" TEXT NOT NULL,
    "kind" TEXT,
    "note" TEXT,
    "provider" TEXT,
    "embedId" TEXT,
    "coverUrl" TEXT,
    "durationSec" INTEGER,
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

-- CreateTable
CREATE TABLE "PersonAlias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonAlias_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "language" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CharacterAlias_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityName" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserEpisodeView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "dramaId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "viewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserEpisodeView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserEpisodeView_dramaId_fkey" FOREIGN KEY ("dramaId") REFERENCES "Drama" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Drama_year_idx" ON "Drama"("year");

-- CreateIndex
CREATE INDEX "Drama_country_idx" ON "Drama"("country");

-- CreateIndex
CREATE INDEX "DramaTitle_titleLower_idx" ON "DramaTitle"("titleLower");

-- CreateIndex
CREATE INDEX "DramaTitle_dramaId_idx" ON "DramaTitle"("dramaId");

-- CreateIndex
CREATE INDEX "DramaMedia_dramaId_idx" ON "DramaMedia"("dramaId");

-- CreateIndex
CREATE UNIQUE INDEX "DramaTheme_name_key" ON "DramaTheme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_name_key" ON "Mood"("name");

-- CreateIndex
CREATE INDEX "UserDramaEntry_userId_status_idx" ON "UserDramaEntry"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserDramaEntry_userId_dramaId_key" ON "UserDramaEntry"("userId", "dramaId");

-- CreateIndex
CREATE INDEX "ViewerTasteItem_userId_kind_isActive_idx" ON "ViewerTasteItem"("userId", "kind", "isActive");

-- CreateIndex
CREATE INDEX "TasteEvidence_tasteItemId_idx" ON "TasteEvidence"("tasteItemId");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_nameLower_idx" ON "Person"("nameLower");

-- CreateIndex
CREATE INDEX "Credit_dramaId_roleType_idx" ON "Credit"("dramaId", "roleType");

-- CreateIndex
CREATE INDEX "Credit_personId_idx" ON "Credit"("personId");

-- CreateIndex
CREATE INDEX "Character_dramaId_idx" ON "Character"("dramaId");

-- CreateIndex
CREATE INDEX "Character_nameLower_idx" ON "Character"("nameLower");

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

-- CreateIndex
CREATE INDEX "PersonAlias_personId_idx" ON "PersonAlias"("personId");

-- CreateIndex
CREATE INDEX "PersonAlias_nameLower_idx" ON "PersonAlias"("nameLower");

-- CreateIndex
CREATE INDEX "PersonSocialLink_personId_idx" ON "PersonSocialLink"("personId");

-- CreateIndex
CREATE INDEX "CharacterAlias_characterId_idx" ON "CharacterAlias"("characterId");

-- CreateIndex
CREATE INDEX "CharacterAlias_nameLower_idx" ON "CharacterAlias"("nameLower");

-- CreateIndex
CREATE INDEX "AdminLog_createdAt_idx" ON "AdminLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminLog_userId_idx" ON "AdminLog"("userId");

-- CreateIndex
CREATE INDEX "UserEpisodeView_userId_viewedAt_idx" ON "UserEpisodeView"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "UserEpisodeView_dramaId_idx" ON "UserEpisodeView"("dramaId");

