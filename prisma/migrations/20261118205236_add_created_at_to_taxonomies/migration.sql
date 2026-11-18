-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DramaTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DramaTheme" ("deletedAt", "id", "name") SELECT "deletedAt", "id", "name" FROM "DramaTheme";
DROP TABLE "DramaTheme";
ALTER TABLE "new_DramaTheme" RENAME TO "DramaTheme";
CREATE UNIQUE INDEX "DramaTheme_name_key" ON "DramaTheme"("name");
CREATE TABLE "new_Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Genre" ("deletedAt", "id", "name") SELECT "deletedAt", "id", "name" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");
CREATE TABLE "new_Mood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Mood" ("deletedAt", "id", "name") SELECT "deletedAt", "id", "name" FROM "Mood";
DROP TABLE "Mood";
ALTER TABLE "new_Mood" RENAME TO "Mood";
CREATE UNIQUE INDEX "Mood_name_key" ON "Mood"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
