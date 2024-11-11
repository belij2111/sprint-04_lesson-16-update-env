import { LikeStatus } from '../../../../likes/domain/like.entity';
import { LikeDetailsModel } from '../../../../likes/api/models/input/like.details.model';

export class ExtendedLikesInfoModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeDetailsModel[];
}
