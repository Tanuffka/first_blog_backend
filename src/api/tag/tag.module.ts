import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tag, TagSchema } from './schema/tag.schema';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

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
