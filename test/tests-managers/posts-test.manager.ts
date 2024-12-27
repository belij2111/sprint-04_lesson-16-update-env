import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CoreConfig } from '../../src/core/core.config';
import { PostCreateModel } from '../../src/features/bloggers-platform/posts/api/models/input/create-post.input.model';
import { PostViewModel } from '../../src/features/bloggers-platform/posts/api/models/view/post.view.model';

export class PostsTestManager {
  constructor(
    private readonly app: INestApplication,
    private readonly coreConfig: CoreConfig,
  ) {}

  async createPost(
    createdModel: PostCreateModel,
    statusCode: number = HttpStatus.CREATED,
  ) {
    const response = await request(this.app.getHttpServer())
      .post('/posts')
      .auth(this.coreConfig.ADMIN_LOGIN, this.coreConfig.ADMIN_PASSWORD)
      .send(createdModel)
      .expect(statusCode);
    return response.body;
  }

  expectCorrectModel(
    createdModel: PostCreateModel,
    responseModel: PostViewModel,
  ) {
    expect(createdModel.title).toBe(responseModel.title);
    expect(createdModel.shortDescription).toBe(responseModel.shortDescription);
    expect(createdModel.content).toBe(responseModel.content);
    expect(createdModel.blogId).toBe(responseModel.blogId);
  }

  async createPostIsNotAuthorized(
    createdModel: PostCreateModel,
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    request(this.app.getHttpServer())
      .post('/posts')
      .auth('invalid login', 'invalid password')
      .send(createdModel)
      .expect(statusCode);
  }
}
