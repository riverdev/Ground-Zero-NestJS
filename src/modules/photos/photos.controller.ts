import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './common/photos.constant';
import { PhotosService } from './photos.service';
//import { multerOptions } from './common/photos.constant';

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService, //private readonly photosHelper: PhotosHelper,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadSinglePhoto(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { imagePath: file.path };
  }

  @Get(':imgpath')
  //todo :  Need to catch the error when the file is not found and send a Not Found exception. Currently a movk-505 error is sent because the error code is not accessable/exists.
  seeUploadedFile(@Param('imgpath') image: string, @Res() res) {
    return res.sendFile(image, { root: 'uploads/photos' });
  }
}
