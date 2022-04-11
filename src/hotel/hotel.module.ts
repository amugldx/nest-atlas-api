import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { AmenitiesModule } from '../amenities/amenities.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [AmenitiesModule, ActivitiesModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
