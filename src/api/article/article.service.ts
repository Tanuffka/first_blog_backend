import { Model } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TagService } from 'src/api/tag/tag.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, type ArticleDocument } from './schema/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly tagService: TagService,
  ) {}

  async create(
    { tags, ...data }: CreateArticleDto,
    userId: string,
  ): Promise<ArticleDocument> {
    const session = await this.articleModel.db.startSession();

    try {
      session.startTransaction();

      const newArticle = new this.articleModel({
        ...data,
        author: userId,
      });

      if (tags?.length > 0) {
        const articleId = newArticle._id.toString();
        const createdTags = await this.tagService.createMultipleTags(
          tags,
          articleId,
        );
        newArticle.set(
          'tags',
          createdTags.map((tag) => tag._id),
        );
      } else {
        newArticle.set('tags', []);
      }

      await newArticle.save();

      await newArticle.populate('author', [
        '_id',
        'firstname',
        'lastname',
        'avatarUrl',
      ]);
      await newArticle.populate('tags', ['_id', 'name']);

      await session.commitTransaction();

      return newArticle;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }
  }

  async findAll(): Promise<ArticleDocument[]> {
    return await this.articleModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', ['_id', 'firstname', 'lastname', 'avatarUrl'])
      .populate('tags', ['_id', 'name'])
      .exec();
  }

  async findById(id: string): Promise<ArticleDocument> {
    return await this.articleModel
      .findById(id)
      .populate('author', ['_id', 'firstname', 'lastname', 'avatarUrl'])
      .populate('tags', ['_id', 'name'])
      .orFail(new NotFoundException('Article not found'))
      .exec();
  }

  async update(
    id: string,
    userId: string,
    { tags, ...data }: UpdateArticleDto,
  ): Promise<ArticleDocument> {
    const session = await this.articleModel.db.startSession();

    try {
      session.startTransaction();

      const updatedTags = await this.tagService.updateTagsForArticleById(
        id,
        tags,
      );

      const updatedArticle = await this.articleModel
        .findOneAndUpdate(
          {
            _id: id,
            author: userId,
          },
          { ...data, tags: updatedTags.map((tag) => tag._id) },
          {
            new: true,
          },
        )
        .populate('author', ['_id', 'firstname', 'lastname', 'avatarUrl'])
        .populate('tags', ['_id', 'name'])
        .orFail(
          new NotFoundException(
            'Article not found or user not authorized to update it',
          ),
        )
        .exec();

      await session.commitTransaction();

      return updatedArticle;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<Pick<ArticleDocument, 'id'>> {
    const session = await this.articleModel.db.startSession();

    try {
      session.startTransaction();

      const deletedArticle = await this.articleModel
        .findOneAndDelete({ _id: id, author: userId })
        .select('id')
        .orFail(
          new NotFoundException(
            'Article not found or user not authorized to delete it',
          ),
        )
        .exec();

      await this.tagService.deleteTagsForArticleById(id);

      await session.commitTransaction();

      return deletedArticle;
    } catch (error) {
      await session.abortTransaction();

      // const err = error as MongooseError;
      throw error;
    }
  }
}
