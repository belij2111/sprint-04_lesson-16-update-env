import { IsUrl, Length, Matches } from 'class-validator';
import { TrimIsString } from '../../../../../../common/decorators/validate/trim-is-string';

export class BlogCreateModel {
  @TrimIsString()
  @Length(3, 15, {
    message: 'name length should be from 3 to 15 symbol',
  })
  name: string;

  @TrimIsString()
  @Length(3, 500, {
    message: 'description length should be from 3 to 500 symbol',
  })
  description: string;

  @TrimIsString()
  @Length(3, 100, {
    message: 'websiteUrl length should be from 3 to 100 symbol',
  })
  @IsUrl()
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    { message: 'websiteUrl has invalid format' },
  )
  websiteUrl: string;
}
