import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { HotelModule } from './hotel/hotel.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { ActivitiesModule } from './activities/activities.module';
import { SingleActivityModule } from './single-activity/single-activity.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    HotelModule,
    AmenitiesModule,
    ActivitiesModule,
    SingleActivityModule,
    BookmarksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
