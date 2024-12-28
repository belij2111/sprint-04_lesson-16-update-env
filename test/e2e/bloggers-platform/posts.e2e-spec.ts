import { HttpStatus, INestApplication } from '@nestjs/common';
import { initSettings } from '../../helpers/init-settings';
import { BlogsTestManager } from '../../tests-managers/blogs-test.manager';
import { deleteAllData } from '../../helpers/delete-all-data';
import { PostsTestManager } from '../../tests-managers/posts-test.manager';
import { BlogCreateModel } from '../../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';
import { createValidBlogModel } from '../../models/bloggers-platform/blog.input.model';
import {
  createInValidPostModel,
  createValidPostModel,
} from '../../models/bloggers-platform/post.input.model';

describe('Posts Components', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;
  let postsTestManager: PostsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    const coreConfig = result.coreConfig;
    blogsTestManager = new BlogsTestManager(app, coreConfig);
    postsTestManager = new PostsTestManager(app, coreConfig);
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

  describe('POST/post', () => {
    it(`should create new post : STATUS 201`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const validPost = createValidPostModel(createdBlog.id);
      const createdResponse = await postsTestManager.createPost(
        validPost,
        HttpStatus.CREATED,
      );
      // console.log(createdResponse);
      postsTestManager.expectCorrectModel(validPost, createdResponse);
    });
    it(`shouldn't create new post with incorrect input data : STATUS 400`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const inValidPost = createInValidPostModel(createdBlog.id);
      // console.log(inValidPost);
      await postsTestManager.createPost(inValidPost, HttpStatus.BAD_REQUEST);
    });
    it(`shouldn't create new post if the request is unauthorized : STATUS 401`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const validPost = createValidPostModel(createdBlog.id);
      await postsTestManager.createPostIsNotAuthorized(
        validPost,
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('GET/posts', () => {
    it(`should return posts with paging : STATUS 200`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const createdPosts = await postsTestManager.createPosts(
        createdBlog.id,
        5,
      );
      const createdResponse = await postsTestManager.getPostsWithPaging(
        HttpStatus.OK,
      );
      postsTestManager.expectCorrectPagination(
        createdPosts,
        createdResponse.body,
      );
      console.log(createdResponse.body);
    });
  });
});
