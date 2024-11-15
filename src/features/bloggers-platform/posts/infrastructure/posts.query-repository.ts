import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { PostViewModel } from '../api/models/view/post.view.model';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../blogs/domain/blog.entity';
import { GetPostQueryParams } from '../api/models/input/create-post.input.model';
import { PaginatedViewModel } from '../../../../core/models/base.paginated.view.model';
import {
  Like,
  LikeModelType,
  LikeStatus,
} from '../../likes/domain/like.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Blog.name) private readonly BlogModel: BlogModelType,
    @InjectModel(Like.name) private readonly LikeModel: LikeModelType,
  ) {}

  async getAll(
    currentUserId: string,
    query: GetPostQueryParams,
  ): Promise<PaginatedViewModel<PostViewModel[]>> {
    const filter = {};
    return this.getPosts(currentUserId, query, filter);
  }

  async getById(
    currentUserId: string,
    id: string,
  ): Promise<PostViewModel | null> {
    const foundPost = await this.PostModel.findById(id);
    if (!foundPost) return null;
    const currentStatus = await this.getStatus(foundPost.id, currentUserId);
    return PostViewModel.mapToView(foundPost, currentStatus);
  }

  async getPostsByBlogId(
    currentUserId: string,
    blogId: string,
    query: GetPostQueryParams,
  ): Promise<PaginatedViewModel<PostViewModel[]>> {
    const foundBlog = await this.findByIdOrNotFoundFail(blogId);
    const filter = {
      blogId: foundBlog.id,
    };
    return this.getPosts(currentUserId, query, filter);
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({ _id: id });
  }

  async findByIdOrNotFoundFail(id: string): Promise<BlogDocument> {
    const foundBlog = await this.findById(id);
    if (!foundBlog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return foundBlog;
  }

  private async getPosts(
    currentUserId: string,
    query: GetPostQueryParams,
    filter: Record<string, any>,
  ): Promise<PaginatedViewModel<PostViewModel[]>> {
    const foundPosts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.PostModel.countDocuments(filter);
    const currentStatuses = await Promise.all(
      foundPosts.map((post) => this.getStatus(post.id, currentUserId)),
    );
    const items = foundPosts.map((post, index) =>
      PostViewModel.mapToView(post, currentStatuses[index]),
    );
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }

  private async getStatus(postId: string, userId: string): Promise<LikeStatus> {
    if (!userId) return LikeStatus.None;
    const like = await this.LikeModel.findOne({
      authorId: userId,
      parentId: postId,
    });
    return like ? like.status : LikeStatus.None;
  }
}
