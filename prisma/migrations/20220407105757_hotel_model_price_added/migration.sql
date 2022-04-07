/*
  Warnings:

  - Added the required column `price` to the `hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotel" ADD COLUMN     "price" INTEGER NOT NULL;
