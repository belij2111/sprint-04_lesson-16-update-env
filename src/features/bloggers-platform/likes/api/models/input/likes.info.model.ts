import { LikeStatus } from '../../../domain/like.entity';

export class LikesInfoModel {
  currentStatus: LikeStatus;
  likesCount: number;
  dislikesCount: number;
}
