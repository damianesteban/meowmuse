-- AlterTable
ALTER TABLE "Cat" ADD COLUMN "imageUrl" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;
