import { HttpStatus, INestApplication } from '@nestjs/common';
import { BlogCreateModel } from '../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import { BlogOutputModel } from '../../src/features/bloggers-platform/blogs/api/models/output/blog.output.model';
import request from 'supertest';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(
    createModel: BlogCreateModel,
    responseModel: BlogOutputModel,
  ) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.description).toBe(responseModel.description);
    expect(createModel.websiteUrl).toBe(responseModel.websiteUrl);
  }
  async createBlog(
    createModel: BlogCreateModel,
    statusCode: number = HttpStatus.CREATED,
  ) {
    return request(this.app.getHttpServer())
      .post('/blogs')
      .send(createModel)
      .expect(statusCode);
  }
}
