import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { PhotosService } from '../modules/photos/photos.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, PhotosService],
})
export class StorageModule {}
