import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { appSettings } from '../../../../settings/config';
import { BlogsService } from '../application/blogs.service';
import { BlogOutputModel } from './models/output/blog.output.model';
import {
  Paginator,
  SearchNameTermFieldsType,
  searchNameTermUtil,
  SortQueryFieldsType,
  sortQueryFieldsUtil,
} from '../../../../base/pagination.base.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { PostCreateModel } from '../../posts/api/models/input/create-post.input.model';
import { PostOutputModel } from '../../posts/api/models/output/post.output.model';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';

@Controller(appSettings.getPath().BLOGS)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  async create(@Body() blogCreateModel: BlogCreateModel) {
    const createdBlogId = await this.blogsService.create(blogCreateModel);
    return await this.blogsQueryRepository.getById(createdBlogId.id);
  }

  @Get()
  async getAll(
    @Query()
    query: SortQueryFieldsType & SearchNameTermFieldsType,
  ): Promise<Paginator<BlogOutputModel[]>> {
    const inputQuery = {
      ...sortQueryFieldsUtil(query),
      ...searchNameTermUtil(query),
    };
    return await this.blogsQueryRepository.getAll(inputQuery);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogOutputModel> {
    const foundBlog = await this.blogsQueryRepository.getById(id);
    if (!foundBlog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return foundBlog;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() blogUpdateModel: BlogCreateModel,
  ) {
    await this.blogsService.update(id, blogUpdateModel);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.blogsService.delete(id);
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postCreateModel: PostCreateModel,
  ): Promise<PostOutputModel | null> {
    const createdPostId = await this.postsService.createPostByBlogId(
      blogId,
      postCreateModel,
    );
    return await this.postsQueryRepository.getById(createdPostId.id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: SortQueryFieldsType,
  ): Promise<Paginator<PostOutputModel[]>> {
    const inputQuery = {
      ...sortQueryFieldsUtil(query),
    };
    return await this.postsQueryRepository.getPostsByBlogId(blogId, inputQuery);
  }
}
