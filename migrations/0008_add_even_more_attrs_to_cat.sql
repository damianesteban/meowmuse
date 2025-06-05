-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "isKitten" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "imageUrl" TEXT,
    "gender" TEXT NOT NULL,
    "weightFactor" TEXT NOT NULL,
    "neuterOrSpayed" BOOLEAN NOT NULL DEFAULT false,
    "activityLevel" TEXT NOT NULL DEFAULT 'medium',
    "vaccinationStatus" TEXT NOT NULL DEFAULT 'unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("age", "breed", "createdAt", "gender", "id", "imageUrl", "isKitten", "name", "notes", "userId", "weight", "weightFactor") SELECT "age", "breed", "createdAt", "gender", "id", "imageUrl", "isKitten", "name", "notes", "userId", "weight", "weightFactor" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
