import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentViewModel } from '../api/models/view/comment.view.model';
import { GetCommentQueryParams } from '../api/models/input/create-comment.input.model';
import { PaginatedViewModel } from '../../../../core/models/base.paginated.view.model';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../posts/domain/post.entity';
import {
  Like,
  LikeModelType,
  LikeStatus,
} from '../../likes/domain/like.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Like.name) private readonly LikeModel: LikeModelType,
  ) {}

  async getCommentById(
    currentUserId: string,
    id: string,
  ): Promise<CommentViewModel> {
    const foundComment = await this.findCommentByIdOrNotFoundFail(id);
    const currentStatus = await this.getStatus(foundComment.id, currentUserId);
    return CommentViewModel.mapToView(foundComment, currentStatus);
  }

  async getCommentsByPostId(
    currentUserId: string,
    postId: string,
    query: GetCommentQueryParams,
  ): Promise<PaginatedViewModel<CommentViewModel[]>> {
    const foundPost = await this.findByIdOrNotFoundFail(postId);
    const filter = { postId: foundPost._id };
    return this.getComments(currentUserId, query, filter);
  }

  private async findPostById(postId: string): Promise<PostDocument | null> {
    return this.PostModel.findById({ _id: postId });
  }

  private async findByIdOrNotFoundFail(postId: string): Promise<PostDocument> {
    const foundPost = await this.findPostById(postId);
    if (!foundPost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return foundPost;
  }

  private async findCommentById(id: string): Promise<CommentDocument | null> {
    return this.CommentModel.findById({ _id: id });
  }

  private async findCommentByIdOrNotFoundFail(
    commentId: string,
  ): Promise<CommentDocument> {
    const foundComment = await this.findCommentById(commentId);
    if (!foundComment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return foundComment;
  }

  private async getComments(
    currentUserId: string,
    query: GetCommentQueryParams,
    filter: Record<string, any>,
  ): Promise<PaginatedViewModel<CommentViewModel[]>> {
    const foundComments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.CommentModel.countDocuments(filter);
    const currentStatuses = await Promise.all(
      foundComments.map((comment) => this.getStatus(comment.id, currentUserId)),
    );
    const items = foundComments.map((comment, index) =>
      CommentViewModel.mapToView(comment, currentStatuses[index]),
    );
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }

  private async getStatus(
    commentId: string,
    userId: string,
  ): Promise<LikeStatus> {
    if (!userId) return LikeStatus.None;
    const like = await this.LikeModel.findOne({
      authorId: userId,
      parentId: commentId,
    });
    return like ? like.status : LikeStatus.None;
  }
}
