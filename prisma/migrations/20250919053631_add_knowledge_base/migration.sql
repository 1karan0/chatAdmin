-- CreateTable
CREATE TABLE "public"."knowledge_base" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "botId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."knowledge_base" ADD CONSTRAINT "knowledge_base_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
