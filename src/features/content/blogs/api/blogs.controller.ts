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

@Controller(appSettings.getPath().BLOGS)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletionResult: boolean = await this.blogsService.delete(id);
    if (!deletionResult) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
  }
}
