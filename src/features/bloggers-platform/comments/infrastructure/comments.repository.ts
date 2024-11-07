import { Injectable } from '@nestjs/common';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async create(comment: Comment): Promise<{ id: string }> {
    const result = await this.CommentModel.create(comment);
    return { id: result._id.toString() };
  }
}
