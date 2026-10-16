-- CreateTable
CREATE TABLE "Drama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "year" INTEGER,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "rating" REAL,
    "cryTag" TEXT,
    "impression" TEXT,
    "review" TEXT,
    "quote" TEXT,
    "episodes" INTEGER,
    "seasons" INTEGER,
    "platforms" TEXT,
    "watchedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Drama_status_idx" ON "Drama"("status");

-- CreateIndex
CREATE INDEX "Drama_year_idx" ON "Drama"("year");
