//storage.service.ts

import { DownloadResponse, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageFile } from './entities/storage-file.object';

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
  } //delete by path

  /**
   * getImage (by path input)
   * @param path
   * @returns
   */
  async getImage(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  } //getImage by path

  //=======================================
  //===   H E L P E R    M E T H O D S
  //=======================================

  getUniqueFileName(originalName: string): string {
    const uniqueID = Date.now() + '-' + Math.round(Math.random() * 1e5);
    const uniqueFileName = uniqueID + '-' + originalName;

    return uniqueFileName;
  }
} //StorageService
