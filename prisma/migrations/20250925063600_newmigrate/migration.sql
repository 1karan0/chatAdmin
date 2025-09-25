-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "website" VARCHAR(500),
ADD COLUMN     "workspace" VARCHAR(255),
ALTER COLUMN "image" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."ChatPosition";
