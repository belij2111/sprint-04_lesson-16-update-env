import { Injectable } from '@nestjs/common';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentViewModel } from '../api/models/view/comment.view.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
  ) {}

  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const foundComment = await this.CommentModel.findById(id);
    if (!foundComment) return null;
    return CommentViewModel.mapToView(foundComment);
  }
}
