import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { WithJWT } from 'src/api/auth/decorators/with-jwt.decorator';

import { FileStorageService } from './file-storage.service';
import { FileStorageDto } from './dto/file-storage.dto';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Post('/upload-url')
  fetchUploadUrl(@Body() body: FileStorageDto) {
    return this.fileStorageService.getUploadUrl(body.fileKey);
  }

  @WithJWT()
  @HttpCode(HttpStatus.OK)
  @Post('/download-url')
  fetchDownloadUrl(@Body() body: FileStorageDto) {
    return this.fileStorageService.getDownloadUrl(body.fileKey);
  }
}
