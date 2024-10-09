class BlogInputModel {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export const createValidBlogModel = (count: number = 1): BlogInputModel => {
  return new BlogInputModel(
    `Blog${count}`,
    `new blog${count}`,
    `https://www.example${count}.com`,
  );
};

export const createInValidBlogModel = (count: number = 1): BlogInputModel => {
  return new BlogInputModel(
    `Blog${count}`,
    `new blog${count}`,
    `invalid url${count}`,
  );
};
