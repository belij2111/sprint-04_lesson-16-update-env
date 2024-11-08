import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentViewModel } from './models/view/comment.view.model';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from '../application/comments.service';
import { CurrentUserId } from '../../../../core/decorators/identification/current-user-id.param.decorator';
import { CommentCreateModel } from './models/input/create-comment.input.model';

@Controller('/comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<CommentViewModel | null> {
    return await this.commentsQueryRepository.getCommentById(id);
  }

  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @CurrentUserId() currentUserId: string,
    @Param('commentId') commentId: string,
    @Body() commentCreateModel: CommentCreateModel,
  ) {
    await this.commentsService.update(
      currentUserId,
      commentId,
      commentCreateModel,
    );
  }
}
