-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "hotelResturant" BOOLEAN NOT NULL,
    "swimmingPool" BOOLEAN NOT NULL,
    "innBar" BOOLEAN NOT NULL,
    "parkingSpot" BOOLEAN NOT NULL,
    "nightClub" BOOLEAN NOT NULL,
    "hotelId" INTEGER NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "amenities_hotelId_key" ON "amenities"("hotelId");

-- AddForeignKey
ALTER TABLE "amenities" ADD CONSTRAINT "amenities_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
