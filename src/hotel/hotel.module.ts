import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { AmenitiesModule } from '../amenities/amenities.module';

@Module({
  imports: [AmenitiesModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
