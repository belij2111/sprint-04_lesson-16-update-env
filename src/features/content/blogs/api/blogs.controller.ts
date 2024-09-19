import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { appSettings } from '../../../../settings/config';
import { BlogsService } from '../application/blogs.service';

@Controller(appSettings.getPath().BLOGS)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletionResult: boolean = await this.blogsService.delete(id);
    if (!deletionResult) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
  }
}
