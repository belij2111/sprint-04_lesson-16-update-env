import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { TestingService } from './application/testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user-accounts/users/domain/user.entity';
import { TestingRepository } from './infrastructure/testing.repository';
import {
  Blog,
  BlogSchema,
} from '../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostSchema,
} from '../bloggers-platform/posts/domain/post.entity';
import {
  Comment,
  CommentSchema,
} from '../bloggers-platform/comments/domain/comment.entity';
import {
  Like,
  LikeSchema,
} from '../bloggers-platform/likes/domain/like.entity';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from '../user-accounts/security-devices/domain/security-devices.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([
      { name: SecurityDevices.name, schema: SecurityDevicesSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService, TestingRepository],
})
export class TestingModule {}
