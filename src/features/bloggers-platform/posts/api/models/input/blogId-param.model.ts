import { TrimIsString } from '../../../../../../core/decorators/validation/trim-is-string';
import { IsMongoId } from 'class-validator';

export class BlogIdParamModel {
  @TrimIsString()
  @IsMongoId({
    message: 'Invalid BlogId',
  })
  blogId: string;
}
