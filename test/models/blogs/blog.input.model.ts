import { BlogCreateModel } from '../../../src/features/bloggers-platform/blogs/api/models/input/create-blog.input.model';

export const createValidBlogModel = (count: number = 1): BlogCreateModel => {
  const blog = new BlogCreateModel();
  blog.name = `Blog${count}`;
  blog.description = `new blog ${count}`;
  blog.websiteUrl = `https://www.example${count}.com`;
  return blog;
};

export const createInValidBlogModel = (count: number = 1): BlogCreateModel => {
  const invalidBlog = new BlogCreateModel();
  invalidBlog.name = `Blog${count}`;
  invalidBlog.description = `new blog ${count}`;
  invalidBlog.websiteUrl = `invalid url${count}`;
  return invalidBlog;
};
