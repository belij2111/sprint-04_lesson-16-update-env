import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../domain/like.entity';
import { LikeInputModel } from '../api/models/input/like.input.model';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

  async create(like: Like): Promise<{ id: string }> {
    const result = await this.LikeModel.create(like);
    return { id: result.id };
  }

  async update(
    foundLike: LikeDocument,
    likeInputModel: LikeInputModel,
  ): Promise<boolean | null> {
    const result = await this.LikeModel.updateOne(
      { _id: foundLike.id },
      { $set: { status: likeInputModel.likeStatus } },
    );
    return result.modifiedCount !== 0;
  }

  async find(userId: string, parentId: string): Promise<LikeDocument | null> {
    return this.LikeModel.findOne({ authorId: userId, parentId: parentId });
  }
}
