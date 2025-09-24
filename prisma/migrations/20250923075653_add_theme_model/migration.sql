-- CreateTable
CREATE TABLE "public"."themes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "botId" UUID NOT NULL,
    "primaryColor" VARCHAR(50) NOT NULL,
    "secondaryColor" VARCHAR(50) NOT NULL,
    "backgroundColor" VARCHAR(50) NOT NULL,
    "textColor" VARCHAR(50) NOT NULL,
    "fontFamily" VARCHAR(100) NOT NULL,
    "fontSize" VARCHAR(20) NOT NULL,
    "borderRadius" VARCHAR(20) NOT NULL,
    "chatPosition" VARCHAR(30) NOT NULL,
    "chatWidth" VARCHAR(20) NOT NULL,
    "chatHeight" VARCHAR(20) NOT NULL,
    "customCSS" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_botId_key" ON "public"."themes"("botId");

-- AddForeignKey
ALTER TABLE "public"."themes" ADD CONSTRAINT "themes_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
