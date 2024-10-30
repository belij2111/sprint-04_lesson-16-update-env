import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import {
  BlogOutputModel,
  QueryBlogFilterType,
} from '../api/models/output/blog.output.model';
import { Paginator } from '../../../../base/pagination.base.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: BlogModelType,
  ) {}

  async getAll(
    inputQuery: QueryBlogFilterType,
  ): Promise<Paginator<BlogOutputModel[]>> {
    const search = inputQuery.searchNameTerm
      ? { name: { $regex: inputQuery.searchNameTerm, $options: 'i' } }
      : {};
    const filter = {
      ...search,
    };
    const items = await this.BlogModel.find(filter)
      .sort({ [inputQuery.sortBy]: inputQuery.sortDirection })
      .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
      .limit(inputQuery.pageSize)
      .exec();
    const totalCount = await this.BlogModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
      page: inputQuery.pageNumber,
      pageSize: inputQuery.pageSize,
      totalCount,
      items: items.map(this.blogMapToOutput),
    };
  }

  async getById(id: string): Promise<BlogOutputModel | null> {
    const foundBlog = await this.BlogModel.findById(id);
    if (!foundBlog) return null;
    return this.blogMapToOutput(foundBlog);
  }

  private blogMapToOutput(blog: BlogDocument): BlogOutputModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
