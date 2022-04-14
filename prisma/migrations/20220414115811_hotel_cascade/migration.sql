-- DropForeignKey
ALTER TABLE "activites" DROP CONSTRAINT "activites_hotelId_fkey";

-- AddForeignKey
ALTER TABLE "activites" ADD CONSTRAINT "activites_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
