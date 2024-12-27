import { HttpStatus, INestApplication } from '@nestjs/common';
import { initSettings } from '../../helpers/init-settings';
import {
  createInValidBlogModel,
  createValidBlogModel,
} from '../../models/bloggers-platform/blog.input.model';
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
      //console.log(createdResponse);
      blogsTestManager.expectCorrectModel(validBlog, createdResponse);
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

  describe('GET/blogs/:id', () => {
    it(`should return blog by ID : STATUS 200`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel();
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      //console.log(createdBlog);
      await blogsTestManager.getBlogById(createdBlog.id, HttpStatus.OK);
    });
    it(`shouldn't return blog by ID if the blog does not exist : STATUS 404`, async () => {
      const nonExistentId = '121212121212121212121212';
      await blogsTestManager.getBlogById(nonExistentId, HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT/blogs/:id', () => {
    it(`should update blog by ID : STATUS 204`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel(1);
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const updatedBlog: BlogCreateModel = createValidBlogModel(555);
      // console.log(updatedBlog);
      await blogsTestManager.updateBlog(
        createdBlog.id,
        updatedBlog,
        HttpStatus.NO_CONTENT,
      );
    });
    it(`shouldn't update blog by ID with incorrect input data : STATUS 400`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel(1);
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const invalidUpdatedBlog: BlogCreateModel = createInValidBlogModel(0);
      await blogsTestManager.updateBlog(
        createdBlog.id,
        invalidUpdatedBlog,
        HttpStatus.BAD_REQUEST,
      );
    });
    it(`shouldn't update blog by ID if the request is unauthorized: STATUS 401`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel(1);
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      const updatedBlog: BlogCreateModel = createValidBlogModel(555);
      await blogsTestManager.updateBlogIsNotAuthorized(
        createdBlog.id,
        updatedBlog,
        HttpStatus.UNAUTHORIZED,
      );
    });
    it(`shouldn't update blog by ID if the blog does not exist : STATUS 404`, async () => {
      const updatedBlog: BlogCreateModel = createValidBlogModel(555);
      const nonExistentId = '121212121212121212121212';
      await blogsTestManager.updateBlog(
        nonExistentId,
        updatedBlog,
        HttpStatus.NOT_FOUND,
      );
    });
  });
  describe('DELETE/blogs/:id', () => {
    it(`should delete blog by ID : STATUS 204`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel(1);
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      await blogsTestManager.deleteById(createdBlog.id, HttpStatus.NO_CONTENT);
    });
    it(`shouldn't delete blog by ID if the request is unauthorized : STATUS 401`, async () => {
      const validBlog: BlogCreateModel = createValidBlogModel(1);
      const createdBlog = await blogsTestManager.createBlog(validBlog);
      await blogsTestManager.deleteByIdIsNotAuthorized(
        createdBlog.id,
        HttpStatus.UNAUTHORIZED,
      );
    });
    it(`shouldn't delete blog by ID if the blog does not exist : STATUS 404`, async () => {
      const nonExistentId = '121212121212121212121212';
      await blogsTestManager.deleteById(nonExistentId, HttpStatus.NOT_FOUND);
    });
  });
});
