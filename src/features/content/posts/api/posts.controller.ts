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
import { PostsService } from '../application/posts.service';
import {
  Paginator,
  SortQueryFieldsType,
  sortQueryFieldsUtil,
} from '../../../../base/pagination.base.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostCreateModel } from './models/input/create-post.input.model';

@Controller(appSettings.getCollectionNames().POSTS)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  async create(@Body() postCreateModel: PostCreateModel) {
    const createdPostId = await this.postsService.create(postCreateModel);
    return await this.postsQueryRepository.getById(createdPostId.id);
  }

  @Get()
  async getAll(
    @Query() query: SortQueryFieldsType,
  ): Promise<Paginator<PostOutputModel[]>> {
    const inputQuery = {
      ...sortQueryFieldsUtil(query),
    };
    return await this.postsQueryRepository.getAll(inputQuery);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostOutputModel> {
    const foundPost = await this.postsQueryRepository.getById(id);
    if (!foundPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return foundPost;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.postsService.delete(id);
  }
}
