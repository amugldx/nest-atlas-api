import { Module } from '@nestjs/common';
import { SingleActivityService } from './single-activity.service';
import { SingleActivityController } from './single-activity.controller';
import { ActivitiesModule } from '../activities/activities.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [ActivitiesModule, CloudinaryModule],
  controllers: [SingleActivityController],
  providers: [SingleActivityService],
})
export class SingleActivityModule {}
