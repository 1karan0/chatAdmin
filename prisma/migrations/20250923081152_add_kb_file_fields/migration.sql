/*
  Warnings:

  - You are about to alter the column `description` on the `bots` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - The `fontFamily` column on the `themes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `chatPosition` column on the `themes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - A unique constraint covering the columns `[apiKey]` on the table `bots` will be added. If there are existing duplicate values, this will fail.
  - Made the column `createdAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."KnowledgeBaseType" AS ENUM ('TEXT', 'URL', 'FILE');

-- CreateEnum
CREATE TYPE "public"."KnowledgeBaseStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ChatPosition" AS ENUM ('bottom_right', 'bottom_left', 'top_right', 'top_left');

-- CreateEnum
CREATE TYPE "public"."FontFamily" AS ENUM ('Inter', 'Roboto', 'OpenSans', 'System');

-- AlterTable
ALTER TABLE "public"."bots" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "public"."knowledge_base" ADD COLUMN     "filePath" VARCHAR(500),
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mimeType" VARCHAR(100),
ADD COLUMN     "sourceUrl" VARCHAR(255),
ADD COLUMN     "status" "public"."KnowledgeBaseStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "public"."KnowledgeBaseType" NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "public"."themes" DROP COLUMN "fontFamily",
ADD COLUMN     "fontFamily" "public"."FontFamily" NOT NULL DEFAULT 'Inter',
DROP COLUMN "chatPosition",
ADD COLUMN     "chatPosition" "public"."ChatPosition" NOT NULL DEFAULT 'bottom_right',
ALTER COLUMN "customCSS" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "image" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bots_apiKey_key" ON "public"."bots"("apiKey");

-- CreateIndex
CREATE INDEX "bots_userId_idx" ON "public"."bots"("userId");

-- CreateIndex
CREATE INDEX "bots_isPublic_status_idx" ON "public"."bots"("isPublic", "status");

-- CreateIndex
CREATE INDEX "conversations_userId_idx" ON "public"."conversations"("userId");

-- CreateIndex
CREATE INDEX "knowledge_base_botId_status_idx" ON "public"."knowledge_base"("botId", "status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");
