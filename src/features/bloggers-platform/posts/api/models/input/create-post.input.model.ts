import { TrimIsString } from '../../../../../../core/decorators/validate/trim-is-string';
import { Length } from 'class-validator';

export class PostCreateModel {
  @TrimIsString()
  @Length(3, 30, {
    message: 'title length should be from 3 to 30 symbol',
  })
  title: string;

  @TrimIsString()
  @Length(3, 100, {
    message: 'shortDescription length should be from 3 to 100 symbol',
  })
  shortDescription: string;

  @TrimIsString()
  @Length(3, 1000, {
    message: 'content length should be from 3 to 1000 symbol',
  })
  content: string;

  @TrimIsString()
  blogId: string;
}
