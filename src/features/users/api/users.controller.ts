import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { appSettings } from '../../../settings/config';
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
import { UserOutputModel } from './models/output/user.output.model';

@Controller(appSettings.getPath().USERS)
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get(
    @Query()
    query: SortQueryFieldsType &
      SearchLoginTermFieldsType &
      SearchEmailTermFieldsType,
  ): Promise<Paginator<UserOutputModel[]>> {
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
