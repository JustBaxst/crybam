-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drama" (
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
    "ratingDouban" REAL,
    "dubbingStudios" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Drama" ("airStatus", "airedFrom", "airedTo", "country", "createdAt", "curatorCryTag", "dubbingStudios", "episodeDuration", "episodes", "id", "posterUrl", "ratingDouban", "ratingIMDB", "ratingKinopoisk", "ratingMDL", "seasons", "synopsis", "title", "updatedAt", "year") SELECT "airStatus", "airedFrom", "airedTo", "country", "createdAt", "curatorCryTag", "dubbingStudios", "episodeDuration", "episodes", "id", "posterUrl", "ratingDouban", "ratingIMDB", "ratingKinopoisk", "ratingMDL", "seasons", "synopsis", "title", "updatedAt", "year" FROM "Drama";
DROP TABLE "Drama";
ALTER TABLE "new_Drama" RENAME TO "Drama";
CREATE INDEX "Drama_year_idx" ON "Drama"("year");
CREATE INDEX "Drama_country_idx" ON "Drama"("country");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
