import { TrimIsString } from '../../../../../core/decorators/validate/trim-is-string';

export class LoginInputModel {
  @TrimIsString()
  loginOrEmail: string;
  @TrimIsString()
  password: string;
}
