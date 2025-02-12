import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CommentCreateModel } from '../../src/features/bloggers-platform/comments/api/models/input/create-comment.input.model';
import { CommentViewModel } from '../../src/features/bloggers-platform/comments/api/models/view/comment.view.model';

export class CommentsTestManager {
  constructor(private readonly app: INestApplication) {}

  async createComment(
    accessToken: string,
    postId: string,
    createdModel: CommentCreateModel,
    statusCode: number = HttpStatus.CREATED,
  ) {
    const response = await request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .auth(accessToken, { type: 'bearer' })
      .send(createdModel)
      .expect(statusCode);
    return response.body;
  }

  expectCorrectModel(
    createdModel: CommentCreateModel,
    responseModel: CommentViewModel,
  ) {
    expect(createdModel.content).toBe(responseModel.content);
  }
}
