import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentCreateModel } from '../api/models/input/create-comment.input.model';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../user-accounts/users/infrastructure/users.repository';
import { Comment } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';
import { LikeInputModel } from '../../likes/api/models/input/like.input.model';
import { Like, LikeStatus } from '../../likes/domain/like.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly likesRepository: LikesRepository,
  ) {}

  async create(
    userId: string,
    postId: string,
    commentCreateModel: CommentCreateModel,
  ): Promise<{ id: string }> {
    const fondUser = await this.usersRepository.findByIdOrNotFoundFail(userId);
    const fondPost = await this.postsRepository.findByIdOrNotFoundFail(postId);
    const createCommentDto: Comment = {
      content: commentCreateModel.content,
      commentatorInfo: {
        userId: fondUser.id,
        userLogin: fondUser.login,
      },
      createdAt: new Date(),
      postId: fondPost.id,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    return await this.commentsRepository.create(createCommentDto);
  }

  async update(
    userId: string,
    commentId: string,
    commentCreateModel: CommentCreateModel,
  ): Promise<boolean | null> {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundFail(commentId);
    if (foundComment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException([
        { field: 'user', message: 'The comment is not your own' },
      ]);
    }
    const updateCommentDto: CommentCreateModel = {
      content: commentCreateModel.content,
    };
    return await this.commentsRepository.update(foundComment, updateCommentDto);
  }

  async delete(userId: string, commentId: string) {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundFail(commentId);
    if (foundComment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException([
        { field: 'user', message: 'The comment is not your own' },
      ]);
    }
    return await this.commentsRepository.delete(foundComment.id);
  }

  async updateLikeStatus(
    currentUserId: string,
    commentId: string,
    likeInputModel: LikeInputModel,
  ) {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundFail(commentId);
    const foundLike = await this.likesRepository.find(currentUserId, commentId);
    let likesInfo: any;
    if (foundLike) {
      likesInfo = this.updateCounts(
        likeInputModel.likeStatus,
        foundLike.status,
        foundComment.likesInfo.likesCount,
        foundComment.likesInfo.dislikesCount,
      );
      const updateCommentDto = {
        likesInfo: {
          likesCount: likesInfo.likesCount,
          dislikesCount: likesInfo.dislikesCount,
          myStatus: likeInputModel.likeStatus,
        },
      };
      await this.likesRepository.update(foundLike, likeInputModel);
      await this.commentsRepository.update(foundComment, updateCommentDto);
    } else {
      const likeDto: Like = {
        createdAt: new Date(),
        status: likeInputModel.likeStatus,
        authorId: currentUserId,
        parentId: commentId,
      };
      await this.likesRepository.create(likeDto);
      likesInfo = this.updateCounts(
        likeInputModel.likeStatus,
        LikeStatus.None,
        foundComment.likesInfo.likesCount,
        foundComment.likesInfo.dislikesCount,
      );
      const updateCommentDto = {
        likesInfo: {
          likesCount: likesInfo.likesCount,
          dislikesCount: likesInfo.dislikesCount,
          myStatus: likeInputModel.likeStatus,
        },
      };
      await this.commentsRepository.update(foundComment, updateCommentDto);
    }
  }

  private updateCounts(
    newStatus: string,
    currentStatus: string,
    likesCount: number,
    dislikesCount: number,
  ) {
    if (newStatus === currentStatus) {
      return { likesCount, dislikesCount };
    }
    switch (newStatus) {
      case LikeStatus.Like:
        if (currentStatus === LikeStatus.None) {
          likesCount++;
        } else if (currentStatus === LikeStatus.Dislike) {
          likesCount++;
          dislikesCount--;
        }
        break;
      case LikeStatus.Dislike:
        if (currentStatus === LikeStatus.None) {
          dislikesCount++;
        } else if (currentStatus === LikeStatus.Like) {
          likesCount--;
          dislikesCount++;
        }
        break;
      case LikeStatus.None:
        if (currentStatus === LikeStatus.Like) {
          likesCount--;
        } else if (currentStatus === LikeStatus.Dislike) {
          dislikesCount--;
        }
        break;
    }
    return { likesCount, dislikesCount };
  }
}
