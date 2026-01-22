import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag, TagSchema } from './schema/tag.schema';

const TagMongooseModule = MongooseModule.forFeature([
  { name: Tag.name, schema: TagSchema },
]);

@Module({
  imports: [TagMongooseModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagMongooseModule, TagService],
})
export class TagModule {}
