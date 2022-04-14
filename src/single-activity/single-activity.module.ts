import { Module } from '@nestjs/common';
import { SingleActivityService } from './single-activity.service';
import { SingleActivityController } from './single-activity.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [SingleActivityController],
  providers: [SingleActivityService],
  exports: [SingleActivityService],
})
export class SingleActivityModule {}
