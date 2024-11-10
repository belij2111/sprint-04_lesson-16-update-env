import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../domain/like.entity';

export class LikeInputModel {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
