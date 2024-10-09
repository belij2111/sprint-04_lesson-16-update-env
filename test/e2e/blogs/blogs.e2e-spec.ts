import { HttpStatus, INestApplication } from '@nestjs/common';
import { initSettings } from '../../utils/init-settings';
import { Connection } from 'mongoose';
import {
  createInValidBlogModel,
  createValidBlogModel,
} from '../../models/blogs/blog.input.model';
import { BlogCreateModel } from '../../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import { BlogsTestManager } from '../../tests-managers/blogs-test.manager';

describe('Blogs Components', () => {
  let app: INestApplication;
  let databaseConnection: Connection;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    databaseConnection = result.databaseConnection;
    blogsTestManager = new BlogsTestManager(app);
  });
  beforeEach(async () => {
    await databaseConnection.dropDatabase();
  });
  afterEach(async () => {
    await databaseConnection.dropDatabase();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('POST/blogs', () => {
    it(`should create new blog : STATUS 201`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      // console.log(validBlog);
      const createResponse = await blogsTestManager.createBlog(validBlog);
      blogsTestManager.expectCorrectModel(validBlog, createResponse.body);
    });
    it(`shouldn't create new blog with incorrect input data : STATUS 400`, async () => {
      const invalidBlog: BlogCreateModel = createInValidBlogModel(777);
      // console.log(invalidBlog);
      await blogsTestManager.createBlog(invalidBlog, HttpStatus.BAD_REQUEST);
    });
  });
});
