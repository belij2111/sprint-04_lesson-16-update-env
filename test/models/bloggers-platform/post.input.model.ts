import { PostCreateModel } from '../../../src/features/bloggers-platform/posts/api/models/input/create-post.input.model';

export const createValidPostModel = (
  blogId: string,
  count: number = 1,
): PostCreateModel => {
  const post = new PostCreateModel();
  post.title = `Post${count}`;
  post.shortDescription = `new post${count}`;
  post.content = `new content of post${count}`;
  post.blogId = blogId;
  return post;
};

export const createInValidPostModel = (
  blogId: string,
  count: number = 1,
): PostCreateModel => {
  const invalidPost = new PostCreateModel();
  invalidPost.title = `33333333333333333333333333333333333333333333333333Post${count}`;
  invalidPost.shortDescription = `new post${count}`;
  invalidPost.content = `new content of post${count}`;
  invalidPost.blogId = blogId;
  return invalidPost;
};
