import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { appSettings } from '../../../../settings/config';
import { PostsService } from '../application/posts.service';

@Controller(appSettings.getCollectionNames().POSTS)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.postsService.delete(id);
  }
}
