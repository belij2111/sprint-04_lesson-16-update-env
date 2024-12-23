import { HttpStatus, INestApplication } from '@nestjs/common';
import { initSettings } from '../../helpers/init-settings';
import {
  createInValidBlogModel,
  createValidBlogModel,
} from '../../models/blogs/blog.input.model';
import { BlogCreateModel } from '../../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import { BlogsTestManager } from '../../tests-managers/blogs-test.manager';
import { deleteAllData } from '../../helpers/delete-all-data';

describe('Blogs Components', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    const coreConfig = result.coreConfig;
    blogsTestManager = new BlogsTestManager(app, coreConfig);
  });
  beforeEach(async () => {
    await deleteAllData(app);
  });
  afterEach(async () => {
    await deleteAllData(app);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('GET/blogs', () => {
    it(`should return blogs with paging : STATUS 200`, async () => {
      const createdBlogs = await blogsTestManager.createBlogs(2);
      const createdResponse = await blogsTestManager.getBlogsWithPaging(
        HttpStatus.OK,
      );
      blogsTestManager.expectCorrectPagination(
        createdBlogs,
        createdResponse.body,
      );
      // console.log(createResponse.body);
    });
  });

  describe('POST/blogs', () => {
    it(`should create new blog : STATUS 201`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      // console.log(validBlog);
      const createdResponse = await blogsTestManager.createBlog(validBlog);
      blogsTestManager.expectCorrectModel(validBlog, createdResponse.body);
    });
    it(`shouldn't create new blog with incorrect input data : STATUS 400`, async () => {
      const invalidBlog: BlogCreateModel = createInValidBlogModel(777);
      // console.log(invalidBlog);
      await blogsTestManager.createBlog(invalidBlog, HttpStatus.BAD_REQUEST);
    });
    it(`shouldn't create new blog if the request is unauthorized : STATUS 401`, async () => {
      const blogIsNotAuthorized: BlogCreateModel = createValidBlogModel();
      // console.log(blogIsNotAuthorized);
      await blogsTestManager.createBlogIsNotAuthorized(
        blogIsNotAuthorized,
        HttpStatus.UNAUTHORIZED,
      );
    });
  });
});
