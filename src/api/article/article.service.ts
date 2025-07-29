import { Model, MongooseError } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schema/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(
    article: CreateArticleDto,
    userId: string,
  ): Promise<ArticleDocument> {
    try {
      const newArticle = new this.articleModel({ ...article, author: userId });
      return newArticle.save();
    } catch (error) {
      const err = error as MongooseError;
      throw new Error('Error creating article: ' + err.message);
    }
  }

  async findAll(): Promise<ArticleDocument[]> {
    return await this.articleModel
      .find()
      .populate('author', ['_id', 'firstname', 'lastname'])
      .exec();
  }

  async findById(id: string): Promise<ArticleDocument> {
    return await this.articleModel
      .findById(id)
      .orFail()
      .populate('author', ['_id', 'firstname', 'lastname'])
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleDocument> {
    return await this.articleModel
      .findOneAndUpdate(
        {
          _id: id,
          author: userId,
        },
        updateArticleDto,
        {
          new: true,
        },
      )
      .orFail(
        new NotFoundException(
          'Article not found or user not authorized to update it',
        ),
      )
      .exec();
  }

  async remove(id: string, userId: string): Promise<ArticleDocument> {
    return await this.articleModel
      .findOneAndDelete({ _id: id, author: userId })
      .select('id')
      .orFail(new NotFoundException('Article not found'))
      .exec();
  }
}
