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

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Blog.name) private readonly BlogModel: BlogModelType,
  ) {}

  async getAll(
    query: GetPostQueryParams,
  ): Promise<PaginatedViewModel<PostViewModel[]>> {
    const filter = {};
    const foundPosts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.PostModel.countDocuments(filter);
    const items = foundPosts.map(PostViewModel.mapToView);
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }

  async getById(id: string): Promise<PostViewModel | null> {
    const foundPost = await this.PostModel.findById(id);
    if (!foundPost) return null;
    return PostViewModel.mapToView(foundPost);
  }

  async getPostsByBlogId(
    blogId: string,
    query: GetPostQueryParams,
  ): Promise<PaginatedViewModel<PostViewModel[]>> {
    const foundBlog = await this.findByIdOrNotFoundFail(blogId);
    const filter = {
      blogId: foundBlog._id,
    };
    const foundPosts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.PostModel.countDocuments(filter);
    const items = foundPosts.map(PostViewModel.mapToView);
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
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
}
