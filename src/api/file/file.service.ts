import * as fs from 'node:fs';
import { join } from 'node:path';

import { Response } from 'express';

import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  getFilePath(fileName: string): string {
    return join(process.cwd(), fileName);
  }

  // WARN: method not checked, if it is working
  getFile(fileName: string, res: Response) {
    return res.sendFile(this.getFilePath(fileName));
  }

  deleteFile(fileName: string): void {
    const filePath = this.getFilePath(fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw new ConflictException(err);
      });
    }
  }
}
