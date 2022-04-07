/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `hotel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hotel_address_key" ON "hotel"("address");
