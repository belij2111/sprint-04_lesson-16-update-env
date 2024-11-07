import { Injectable } from '@nestjs/common';
import { CommentCreateModel } from '../api/models/input/create-comment.input.model';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { Comment } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
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
}
