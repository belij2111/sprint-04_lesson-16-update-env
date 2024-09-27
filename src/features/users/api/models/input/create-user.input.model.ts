import { IsEmail, Length, Matches } from 'class-validator';
import { TrimIsString } from '../../../../../common/decorators/validate/trim-is-string';

export class UserCreateModel {
  @TrimIsString()
  @Length(3, 10, {
    message: 'login length should be from 3 to 10 symbols',
  })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'login should contain only letters, numbers, underscores, and hyphens',
  })
  login: string;

  @TrimIsString()
  @Length(6, 20, {
    message: 'password length should be from 6 to 20 symbols',
  })
  password: string;

  @TrimIsString()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'email should follow the pattern: example@example.com',
  })
  email: string;
}
