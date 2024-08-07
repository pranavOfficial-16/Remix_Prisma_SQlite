/*
  Warnings:

  - You are about to drop the column `words` on the `Dictionary` table. All the data in the column will be lost.
  - Added the required column `word` to the `Dictionary` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dictionary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "partsofspeech" TEXT NOT NULL,
    "definition" TEXT NOT NULL
);
INSERT INTO "new_Dictionary" ("definition", "id", "partsofspeech") SELECT "definition", "id", "partsofspeech" FROM "Dictionary";
DROP TABLE "Dictionary";
ALTER TABLE "new_Dictionary" RENAME TO "Dictionary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
