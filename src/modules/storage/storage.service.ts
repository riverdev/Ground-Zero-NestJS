//storage.service.ts

import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  //================================================================

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('STORAGE_PROJECT_ID'),

      credentials: {
        client_email: configService.get('STORAGE_CLIENT_EMAIL'),
        private_key: configService.get('STORAGE_PRIVATE_KEY'),
      },
    });

    this.bucket = configService.get('STORAGE_MEDIA_BUCKET');
  }

  //================================================================

  /**
   * save (uploads to bucket)
   * @param path
   * @param contentType
   * @param media
   * @param metadata
   */
  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});

    const file = this.storage.bucket(this.bucket).file(path);

    const stream = file.createWriteStream();

    stream
      .on('error', () => {
        throw new BadRequestException(
          `Unable to upload image, something went wrong`,
        );
      })
      .on('finish', async () => {
        return await file.setMetadata({
          metadata: object,
        });
      });
    stream.end(media);
  } //save by path,content-type,media,metadata

  //================================================================

  /**
   * delete (by path input)
   * @param path
   */
  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });

    //todo-bug-(1):
    //todo (1) After calling this function the delete works but there is no response. The Http response never happens and the APi client is stuck waiting   for the "done" response.
    //todo (1) From initial research it may have to do with the "Post controller interceptor logic" the resource for this is: https://docs.nestjs.com/techniques/streaming-files

    //return 'done';
  } //delete by path

  //=======================================
  //===   H E L P E R    M E T H O D S
  //=======================================

  getUniqueFileName(originalName: string): string {
    const uniqueID = Date.now() + '-' + Math.round(Math.random() * 1e5);
    const uniqueFileName = uniqueID + '-' + originalName;

    return uniqueFileName;
  }
} //StorageService
