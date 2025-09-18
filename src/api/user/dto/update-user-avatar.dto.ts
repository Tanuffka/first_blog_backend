import { IsNotEmpty } from 'class-validator';

import { IsImageFile } from 'src/shared/validators/image.validator';

export class UpdateUserAvatarDto {
  @IsImageFile({ message: 'Invalid MIME type of the uploaded file' })
  @IsNotEmpty({ message: 'Avatar is required' })
  avatar: Express.Multer.File;
}
