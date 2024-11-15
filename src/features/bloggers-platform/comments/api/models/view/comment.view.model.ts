import { CommentDocument } from '../../../domain/comment.entity';
import { LikeStatus } from '../../../../likes/domain/like.entity';

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
    myStatus: LikeStatus;
  };

  static mapToView(
    comment: CommentDocument,
    currentStatus: LikeStatus,
  ): CommentViewModel {
    const model = new CommentViewModel();
    model.id = comment.id;
    model.content = comment.content;
    model.commentatorInfo = comment.commentatorInfo;
    model.createdAt = comment.createdAt;
    model.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: currentStatus,
    };

    return model;
  }
}
