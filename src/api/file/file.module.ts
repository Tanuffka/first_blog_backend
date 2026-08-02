import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { fileFilter, multerConfig } from './multer.config';
// import { FileController } from './file.controller';

@Module({
  // controllers: [FileController],
  providers: [FileService],
  imports: [
    MulterModule.register({
      storage: multerConfig.storage,
      fileFilter,
    }),
  ],
  exports: [FileService, MulterModule],
})
export class FileModule {}
