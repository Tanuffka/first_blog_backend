import { Model, type QueryFilter, type PipelineStage, Types } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FileStorageService } from 'src/api/file-storage/file-storage.service';
import { TagService } from 'src/api/tag/tag.service';
import { SOCIAL_USER_FIELDS } from 'src/api/user/schema/user.schema';
import { PageMetaDto } from 'src/shared/modules/page/dto/page-meta.dto';
import { PageDto } from 'src/shared/modules/page/dto/page.dto';
import { Order } from 'src/shared/types/common.type';

import { CreateArticleDto } from './dto/create-article.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, type ArticleDocument } from './schema/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly tagService: TagService,
    private readonly fileStorageService: FileStorageService,
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
        author: new Types.ObjectId(userId),
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

      await newArticle.populate('author', SOCIAL_USER_FIELDS);
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
      .populate('author', SOCIAL_USER_FIELDS)
      .populate('tags', ['_id', 'name'])
      .exec();
  }

  async findAllWithSearchParams({
    title,
    tags,
    author: authorId,
    skip,
    limit,
    order,
    page,
  }: SearchQueryDto): Promise<PageDto<ArticleDocument>> {
    const query: QueryFilter<Article> = {};

    const tagsArray = tags ? tags.split(',') : [];

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (authorId) {
      query.author = new Types.ObjectId(authorId);
    }

    const pipeline: PipelineStage[] = [];

    /** @description Match articles based on the query */
    pipeline.push({ $match: query });

    /** @description Project the desired fields */
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        viewsCount: 1,
        createdAt: 1,
        updatedAt: 1,
        tags: 1,
        author: 1,
      },
    });

    /** @description Lookup for the tags and populate them */
    pipeline.push({
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: 'tags',
      },
    });

    /** @description Match articles based on the tags */
    if (tagsArray.length > 0) {
      pipeline.push({
        $match: { 'tags.name': { $in: tagsArray } },
      });
    }

    /** @description Lookup for the author and populate it */
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 0,
              firstname: 1,
              lastname: 1,
              avatarUrl: 1,
            },
          },
        ],
        as: 'author',
      },
    });

    /** @description Set the author field to the first element of the author array */
    pipeline.push({
      $set: {
        author: { $first: '$author' },
      },
    });

    /** @description Sort, skip, and limit the results */
    pipeline.push({ $sort: { createdAt: order === Order.ASC ? 1 : -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const articles = await this.articleModel.aggregate(pipeline);

    const totalItems = await this.articleModel.countDocuments();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { skip, limit, order, page },
      itemCount: totalItems,
    });

    return new PageDto<ArticleDocument>(articles, pageMetaDto);
  }

  async findById(id: string): Promise<ArticleDocument> {
    return await this.articleModel
      .findById(id)
      .populate('author', SOCIAL_USER_FIELDS)
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

      const currentArticle = await this.articleModel.findById(id);

      const updatedTags = await this.tagService.updateTagsForArticleById(
        id,
        tags,
      );

      const updatedArticle = await this.articleModel
        .findOneAndUpdate(
          {
            _id: id,
            author: new Types.ObjectId(userId),
          },
          { ...data, tags: updatedTags.map((tag) => tag._id) },
          {
            new: true,
          },
        )
        .populate('author', SOCIAL_USER_FIELDS)
        .populate('tags', ['_id', 'name'])
        .orFail(
          new NotFoundException(
            'Article not found or user not authorized to update it',
          ),
        )
        .exec();

      if (currentArticle?.coverImage !== data.coverImage) {
        await this.fileStorageService.deleteObjectByFileKey(
          currentArticle!.coverImage,
        );
      }

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
        .findOneAndDelete({ _id: id, author: new Types.ObjectId(userId) })
        .select('id coverImage')
        .orFail(
          new NotFoundException(
            'Article not found or user not authorized to delete it',
          ),
        )
        .exec();

      await this.tagService.deleteTagsForArticleById(id);
      await this.fileStorageService.deleteObjectByFileKey(
        deletedArticle.coverImage,
      );

      await session.commitTransaction();

      return deletedArticle;
    } catch (error) {
      await session.abortTransaction();

      // const err = error as MongooseError;
      throw error;
    }
  }
}
