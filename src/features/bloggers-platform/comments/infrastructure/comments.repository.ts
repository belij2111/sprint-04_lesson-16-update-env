import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentCreateModel } from '../api/models/input/create-comment.input.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async create(comment: Comment): Promise<{ id: string }> {
    const result = await this.CommentModel.create(comment);
    return { id: result._id.toString() };
  }

  async findById(commentId: string) {
    return this.CommentModel.findById({ _id: commentId });
  }

  async findByIdOrNotFoundFail(commentId: string) {
    const foundComment = await this.findById(commentId);
    if (!foundComment) {
      throw new NotFoundException([
        { field: 'foundComment', message: 'Comment not found' },
      ]);
    }
    return foundComment;
  }

  async update(
    foundComment: CommentDocument,
    updateCommentDto: CommentCreateModel,
  ) {
    const result = await this.CommentModel.updateOne(
      { _id: foundComment._id },
      { $set: updateCommentDto },
    );
    return result.modifiedCount !== 0;
  }
}
