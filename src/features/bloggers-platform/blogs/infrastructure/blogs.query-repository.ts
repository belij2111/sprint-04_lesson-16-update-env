import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogViewModel } from '../api/models/view/blog.view.model';
import { GetBlogsQueryParams } from '../api/models/input/create-blog.input.model';
import { PaginatedViewModel } from '../../../../core/models/base.paginated.view.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: BlogModelType,
  ) {}

  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewModel<BlogViewModel[]>> {
    const search = query.searchNameTerm
      ? { name: { $regex: query.searchNameTerm || '', $options: 'i' } }
      : {};
    const filter = {
      ...search,
    };
    const foundBlogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .exec();
    const totalCount = await this.BlogModel.countDocuments(filter);
    const items = foundBlogs.map(BlogViewModel.mapToView);
    return PaginatedViewModel.mapToView({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }

  async getById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await this.BlogModel.findById(id);
    if (!foundBlog) return null;
    return BlogViewModel.mapToView(foundBlog);
  }
}
