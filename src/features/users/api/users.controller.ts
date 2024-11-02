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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import {
  Paginator,
  SearchEmailTermFieldsType,
  searchEmailTermUtil,
  SearchLoginTermFieldsType,
  searchLoginTermUtil,
  SortQueryFieldsType,
  sortQueryFieldsUtil,
} from '../../../base/pagination.base.model';
import { UserViewModel } from './models/view/user.view.model';
import { UserCreateModel } from './models/input/create-user.input.model';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('/users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth()
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userCreateModel: UserCreateModel) {
    const createdUserId = await this.usersService.create(userCreateModel);
    return await this.usersQueryRepository.getById(createdUserId.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async get(
    @Query()
    query: SortQueryFieldsType &
      SearchLoginTermFieldsType &
      SearchEmailTermFieldsType,
  ): Promise<Paginator<UserViewModel[]>> {
    const inputQuery = {
      ...sortQueryFieldsUtil(query),
      ...searchLoginTermUtil(query),
      ...searchEmailTermUtil(query),
    };

    return await this.usersQueryRepository.getUsers(inputQuery);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletionResult: boolean = await this.usersService.delete(id);
    if (!deletionResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
