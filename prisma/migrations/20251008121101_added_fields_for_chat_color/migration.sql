/*
  Warnings:

  - You are about to drop the column `yourtextColor` on the `themes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."themes" DROP COLUMN "yourtextColor",
ADD COLUMN     "bottomColor" VARCHAR(50),
ADD COLUMN     "chatyourtextColor" VARCHAR(50),
ADD COLUMN     "youryourtextColor" VARCHAR(50);
