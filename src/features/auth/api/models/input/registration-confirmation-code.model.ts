import { TrimIsString } from '../../../../../core/decorators/validation/trim-is-string';

export class RegistrationConfirmationCodeModel {
  @TrimIsString()
  code: string;
}
