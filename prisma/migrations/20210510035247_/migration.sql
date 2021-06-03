-- CreateTable
CREATE TABLE "ApiKey" (
    "key" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,

    PRIMARY KEY ("key")
);
