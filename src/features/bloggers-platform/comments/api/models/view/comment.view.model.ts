import { CommentDocument } from '../../../domain/comment.entity';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  static mapToView(comment: CommentDocument): CommentViewModel {
    const model = new CommentViewModel();
    model.id = comment._id.toString();
    model.content = comment.content;
    model.commentatorInfo = comment.commentatorInfo;
    model.createdAt = comment.createdAt;
    model.likesInfo = comment.likesInfo;

    return model;
  }
}
