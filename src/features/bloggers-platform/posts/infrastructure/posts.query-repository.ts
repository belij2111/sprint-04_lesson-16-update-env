import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Paginator,
  SortQueryFilterType,
} from '../../../../base/pagination.base.model';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { PostOutputModel } from '../api/models/output/post.output.model';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../blogs/domain/blog.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Blog.name) private readonly BlogModel: BlogModelType,
  ) {}

  async getAll(
    inputQuery: SortQueryFilterType,
  ): Promise<Paginator<PostOutputModel[]>> {
    const filter = {};
    const items = await this.PostModel.find(filter)
      .sort({ [inputQuery.sortBy]: inputQuery.sortDirection })
      .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
      .limit(inputQuery.pageSize)
      .exec();
    const totalCount = await this.PostModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
      page: inputQuery.pageNumber,
      pageSize: inputQuery.pageSize,
      totalCount,
      items: items.map(this.postMapToOutput),
    };
  }

  async getById(id: string): Promise<PostOutputModel | null> {
    const foundPost = await this.PostModel.findById(id);
    if (!foundPost) return null;
    return this.postMapToOutput(foundPost);
  }

  async getPostsByBlogId(
    blogId: string,
    inputQuery: SortQueryFilterType,
  ): Promise<Paginator<PostOutputModel[]>> {
    await this.findByIdOrNotFoundFail(blogId);
    const filter = {
      blogId: new ObjectId(blogId),
    };
    const items = await this.PostModel.find(filter)
      .sort({ [inputQuery.sortBy]: inputQuery.sortDirection })
      .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
      .limit(inputQuery.pageSize)
      .exec();
    const totalCount = await this.PostModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
      page: inputQuery.pageNumber,
      pageSize: inputQuery.pageSize,
      totalCount,
      items: items.map(this.postMapToOutput),
    };
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

  private postMapToOutput(post: PostDocument): PostOutputModel {
    const newestLikes = post.extendedLikesInfo.newestLikes.map((el) => ({
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.login,
    }));
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: newestLikes,
      },
    };
  }
}
