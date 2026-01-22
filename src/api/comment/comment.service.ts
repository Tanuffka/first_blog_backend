import { Model, MongooseError } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SOCIAL_USER_FIELDS } from 'src/api/user/schema/user.schema';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schema/comment.schema';

const COMMENT_POPULATION_QUERY = [
  {
    path: 'author',
    select: SOCIAL_USER_FIELDS,
  },
  {
    path: 'article',
    select: 'id',
  },
  {
    path: 'responseTo',
    populate: {
      path: 'author',
      select: SOCIAL_USER_FIELDS,
    },
  },
];

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    comment: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    try {
      const newComment = await this.commentModel.create({
        ...comment,
        author: userId,
      });

      return newComment.populate(COMMENT_POPULATION_QUERY);
    } catch (error) {
      const err = error as MongooseError;
      throw new Error('Error creating comment: ' + err.message);
    }
  }

  async findAllByArticleId(id: string): Promise<CommentDocument[]> {
    return await this.commentModel
      .find({ article: id })
      .orFail(new NotFoundException('Comments not found'))
      .populate(COMMENT_POPULATION_QUERY)
      .exec();
  }

  async findById(id: string): Promise<CommentDocument> {
    return await this.commentModel
      .findById(id)
      .orFail(new NotFoundException('Comment not found'))
      .populate(COMMENT_POPULATION_QUERY)
      .exec();
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCommentDto,
  ): Promise<CommentDocument> {
    return await this.commentModel
      .findOneAndUpdate(
        {
          _id: id,
          author: userId,
        },
        { ...data, isEdited: true },
        {
          new: true,
          populate: COMMENT_POPULATION_QUERY,
        },
      )
      .orFail(
        new NotFoundException(
          'Comment not found or user not authorized to update it',
        ),
      )
      .exec();
  }

  async delete(id: string, userId: string): Promise<CommentDocument> {
    return await this.commentModel
      .findOneAndDelete({ _id: id, author: userId })
      .select('id')
      .orFail(
        new NotFoundException(
          'Comment not found or user not authorized to delete it',
        ),
      )
      .exec();
  }
}
