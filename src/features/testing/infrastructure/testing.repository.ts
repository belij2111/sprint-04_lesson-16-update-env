import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserModelType,
} from '../../user-accounts/users/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostModelType,
} from '../../bloggers-platform/posts/domain/post.entity';
import {
  Comment,
  CommentModelType,
} from '../../bloggers-platform/comments/domain/comment.entity';
import {
  Like,
  LikeModelType,
} from '../../bloggers-platform/likes/domain/like.entity';
import {
  SecurityDevices,
  SecurityDevicesModelType,
} from '../../user-accounts/security-devices/domain/security-devices.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    @InjectModel(SecurityDevices.name)
    private SecurityDevicesModel: SecurityDevicesModelType,
  ) {}

  async deleteAllData() {
    await Promise.all([
      this.UserModel.deleteMany(),
      this.BlogModel.deleteMany(),
      this.PostModel.deleteMany(),
      this.CommentModel.deleteMany(),
      this.LikeModel.deleteMany(),
      this.SecurityDevicesModel.deleteMany(),
    ]);
  }
}
