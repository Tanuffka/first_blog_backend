import { extname } from 'path';
import * as fs from 'node:fs';

import { diskStorage } from 'multer';

import { PublicUserData } from 'src/api/user/schema/user.schema';

import type { Request } from 'express';

export const multerConfig = {
  preservePaths: true,
  storage: diskStorage({
    destination: (req, file, callback) => {
      const entityId = req.params.id;
      const authenticatedUser = req.user as PublicUserData | undefined;
      const isSourceAvatar = req.path.includes('/me/avatar');
      if (!authenticatedUser || (!isSourceAvatar && !entityId)) {
        return callback(new Error('Source not found or ID not valid'), '');
      }
      const extraPath = isSourceAvatar
        ? `users/${authenticatedUser.id}`
        : `${entityId}`;
      const path = `./public/${extraPath}`;
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
      callback(null, fileName);
    },
  }),
};

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Allow only image files
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files are allowed'), false);
  }
  callback(null, true);
};
