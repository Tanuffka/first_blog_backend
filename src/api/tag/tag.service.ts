import { Model, MongooseError } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Tag, TagDocument } from './schema/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async createOneTag(name: string, articleId: string): Promise<TagDocument> {
    try {
      const newTag = await this.tagModel.create({
        name,
        article: articleId,
      });

      return newTag;
    } catch (error) {
      const err = error as MongooseError;
      throw new Error('Error creating tag: ' + err.message);
    }
  }

  async createMultipleTags(
    tags: string[],
    articleId: string,
  ): Promise<TagDocument[]> {
    try {
      const newTags = await this.tagModel.create(
        tags.map((tag) => ({
          name: tag,
          article: articleId,
        })),
      );

      return newTags;
    } catch (error) {
      const err = error as MongooseError;
      throw new Error('Error creating tag: ' + err.message);
    }
  }

  async findAll(): Promise<TagDocument[]> {
    return await this.tagModel.find().exec();
  }

  async findAllByArticleId(id: string): Promise<TagDocument[]> {
    return await this.tagModel
      .find({ article: id })
      .orFail(new NotFoundException('Tags not found'))
      .exec();
  }

  async findById(id: string): Promise<TagDocument> {
    return await this.tagModel
      .findById(id)
      .orFail(new NotFoundException('Tag not found'))
      .exec();
  }

  async updateTagsForArticleById(
    articleId: string,
    tags: string[],
  ): Promise<TagDocument[]> {
    const currentTags = await this.tagModel.find({ article: articleId });

    /** @description if tag was removed from article, remove from the table */
    for (const tag of currentTags) {
      if (!tags.includes(tag.name)) {
        await this.delete(tag._id.toString());
      }
    }

    /** @description create tag, if it was not found */
    for (const tag of tags) {
      const foundTag = await this.tagModel.findOne({
        article: articleId,
        name: tag,
      });

      if (!foundTag) {
        await this.createOneTag(tag, articleId);
      }
    }

    return await this.findAllByArticleId(articleId);
  }

  async deleteTagsForArticleById(articleId?: string): Promise<void> {
    await this.tagModel
      .deleteMany({ article: articleId })
      .orFail(new NotFoundException('Tags failed to delete'))
      .exec();
  }

  async delete(
    id: string,
    articleId?: string,
  ): Promise<Pick<TagDocument, 'id'>> {
    return await this.tagModel
      .findOneAndDelete({ _id: id, article: articleId })
      .select('id')
      .orFail(new NotFoundException('Tag not found'))
      .exec();
  }
}
