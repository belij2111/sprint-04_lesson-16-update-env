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
import { UserViewModel } from './models/view/user.view.model';
import {
  GetUsersQueryParams,
  UserCreateModel,
} from './models/input/create-user.input.model';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';
import { PaginatedViewModel } from '../../../core/models/base.paginated.view.model';

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
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewModel<UserViewModel[]>> {
    return await this.usersQueryRepository.getUsers(query);
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
