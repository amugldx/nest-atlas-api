/*
  Warnings:

  - Added the required column `imageId` to the `hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `hotel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('natures_light', 'cultural', 'mordern_life', 'popularity', 'sun_and_sand');

-- AlterTable
ALTER TABLE "hotel" ADD COLUMN     "imageId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "singleActivity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "activitiesId" INTEGER NOT NULL,

    CONSTRAINT "singleActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activites" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hotelId" INTEGER NOT NULL,

    CONSTRAINT "activites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activites_hotelId_key" ON "activites"("hotelId");

-- AddForeignKey
ALTER TABLE "singleActivity" ADD CONSTRAINT "singleActivity_activitiesId_fkey" FOREIGN KEY ("activitiesId") REFERENCES "activites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activites" ADD CONSTRAINT "activites_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
