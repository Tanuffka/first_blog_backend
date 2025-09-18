import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { FileUploadInterceptor } from './file-upload.interceptor';

export function WithFileUpload() {
  return applyDecorators(UseInterceptors(FileUploadInterceptor));
}
