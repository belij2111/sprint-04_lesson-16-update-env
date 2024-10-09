import { HttpStatus, INestApplication } from '@nestjs/common';
import { BlogCreateModel } from '../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import { BlogOutputModel } from '../../src/features/bloggers-platform/blogs/api/models/output/blog.output.model';
import request from 'supertest';
import { paginationParams } from '../models/base/pagination.model';
import { createValidBlogModel } from '../models/blogs/blog.input.model';
import { Paginator } from '../../src/base/pagination.base.model';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(
    createModel: BlogCreateModel,
    statusCode: number = HttpStatus.CREATED,
  ) {
    return request(this.app.getHttpServer())
      .post('/blogs')
      .send(createModel)
      .expect(statusCode);
  }

  expectCorrectModel(
    createModel: BlogCreateModel,
    responseModel: BlogOutputModel,
  ) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.description).toBe(responseModel.description);
    expect(createModel.websiteUrl).toBe(responseModel.websiteUrl);
  }

  async createBlogs(
    count: number = 1,
    statusCode: number = HttpStatus.CREATED,
  ) {
    const blogs: BlogOutputModel[] = [];
    for (let i = 1; i <= count; i++) {
      const response = await request(this.app.getHttpServer())
        .post('/blogs')
        .send(createValidBlogModel(i))
        .expect(statusCode);
      blogs.push(response.body);
    }
    return blogs;
  }

  async getBlogsWithPaging(statusCode: number = HttpStatus.OK) {
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationParams;
    const searchNameTerm = 'Blog';
    return request(this.app.getHttpServer())
      .get('/blogs')
      .query({
        searchNameTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      })
      .expect(statusCode);
  }

  expectCorrectPagination(
    createModels: BlogOutputModel[],
    responseModels: Paginator<BlogOutputModel[]>,
  ) {
    expect(responseModels.items.length).toBe(createModels.length);
    expect(responseModels.totalCount).toBe(createModels.length);
    expect(responseModels.items).toEqual(createModels);
    expect(responseModels.pagesCount).toBe(1);
    expect(responseModels.page).toBe(1);
    expect(responseModels.pageSize).toBe(10);
  }
}
