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

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async getCommentById(id: string): Promise<CommentViewModel> {
    const foundComment = await this.findCommentByIdOrNotFoundFail(id);
    return CommentViewModel.mapToView(foundComment);
  }

  async getCommentsByPostId(
    postId: string,
    query: GetCommentQueryParams,
  ): Promise<PaginatedViewModel<CommentViewModel[]>> {
    const foundPost = await this.findByIdOrNotFoundFail(postId);
    const filter = { postId: foundPost._id };
    return this.getComments(query, filter);
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
    query: GetCommentQueryParams,
    filter: Record<string, any>,
  ): Promise<PaginatedViewModel<CommentViewModel[]>> {
    const foundComments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.CommentModel.countDocuments(filter);
    const items = foundComments.map(CommentViewModel.mapToView);
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }
}
