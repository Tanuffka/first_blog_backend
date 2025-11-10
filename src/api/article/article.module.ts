import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentModule } from 'src/api/comment/comment.module';

import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article, ArticleSchema } from './schema/article.schema';

const ArticleMongooseModule = MongooseModule.forFeature([
  { name: Article.name, schema: ArticleSchema },
]);

@Module({
  imports: [ArticleMongooseModule, CommentModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
