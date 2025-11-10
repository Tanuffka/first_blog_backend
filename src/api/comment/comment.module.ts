import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './schema/comment.schema';

const CommentMongooseModule = MongooseModule.forFeature([
  { name: Comment.name, schema: CommentSchema },
]);

@Module({
  imports: [CommentMongooseModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentMongooseModule, CommentService],
})
export class CommentModule {}
