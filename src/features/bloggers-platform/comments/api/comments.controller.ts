import { Controller, Get, Param } from '@nestjs/common';
import { CommentViewModel } from './models/view/comment.view.model';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';

@Controller('/comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<CommentViewModel | null> {
    return await this.commentsQueryRepository.getCommentById(id);
  }
}
