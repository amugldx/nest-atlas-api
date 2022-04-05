import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [CloudinaryModule],
})
export class ProfileModule {}
