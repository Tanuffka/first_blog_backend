import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';

import { FileService } from './file.service';

import type { Response } from 'express';

/** NOTE: currently not working */
@Controller('public')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/users/:filePath')
  fetchUserFile(@Param('filePath') filePath: string, @Res() res: Response) {
    console.log(111);
    return this.fileService.getFile(filePath, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:filePath')
  fetchFile(@Param('filePath') filePath: string, @Res() res: Response) {
    console.log(222);
    return this.fileService.getFile(filePath, res);
  }
}
