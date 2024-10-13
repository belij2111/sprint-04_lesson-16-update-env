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
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import {
  Paginator,
  SortQueryFieldsType,
  sortQueryFieldsUtil,
} from '../../../../base/pagination.base.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostCreateModel } from './models/input/create-post.input.model';
import { BasicAuthGuard } from '../../../../common/guards/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
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

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() postCreateModel: PostCreateModel,
  ) {
    await this.postsService.update(id, postCreateModel);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.postsService.delete(id);
  }
}
