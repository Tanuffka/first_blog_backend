import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('FIRST BLOG API')
    .setDescription('First Blog API description')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth()
    .build();
}
