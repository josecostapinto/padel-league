/*
  Warnings:

  - You are about to drop the column `loserId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `loser1Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loser2Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner1Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner2Id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "winner1Id" TEXT NOT NULL,
    "winner2Id" TEXT NOT NULL,
    "loser1Id" TEXT NOT NULL,
    "loser2Id" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_winner1Id_fkey" FOREIGN KEY ("winner1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_winner2Id_fkey" FOREIGN KEY ("winner2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_loser1Id_fkey" FOREIGN KEY ("loser1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_loser2Id_fkey" FOREIGN KEY ("loser2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "playedAt", "updatedAt") SELECT "createdAt", "id", "playedAt", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
