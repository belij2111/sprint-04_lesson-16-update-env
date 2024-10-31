import { TrimIsString } from '../../../../../common/decorators/validate/trim-is-string';

export class LoginInputModel {
  @TrimIsString()
  loginOrEmail: string;
  @TrimIsString()
  password: string;
}
