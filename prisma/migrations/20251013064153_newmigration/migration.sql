/*
  Warnings:

  - You are about to drop the column `chatyourtextColor` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `youryourtextColor` on the `themes` table. All the data in the column will be lost.
  - Added the required column `tenant_id` to the `bots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."bots" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."themes" DROP COLUMN "chatyourtextColor",
DROP COLUMN "youryourtextColor",
ADD COLUMN     "chattextColor" VARCHAR(50),
ADD COLUMN     "yourtextColor" VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "tenantsTenant_id" UUID;

-- CreateTable
CREATE TABLE "public"."knowledge_sources" (
    "source_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "source_type" VARCHAR NOT NULL,
    "source_url" TEXT,
    "source_content" TEXT,
    "file_name" VARCHAR,
    "file_content" TEXT,
    "status" VARCHAR,
    "error_message" TEXT,
    "source_metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_sources_pkey" PRIMARY KEY ("source_id")
);

-- CreateTable
CREATE TABLE "public"."tenants" (
    "tenant_id" UUID NOT NULL,
    "tenant_name" VARCHAR NOT NULL,
    "is_active" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_tenant_name_key" ON "public"."tenants"("tenant_name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenantsTenant_id_fkey" FOREIGN KEY ("tenantsTenant_id") REFERENCES "public"."tenants"("tenant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."knowledge_sources" ADD CONSTRAINT "knowledge_sources_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("tenant_id") ON DELETE CASCADE ON UPDATE NO ACTION;
