import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../base/bcrypt.service';
import { LoginInputModel } from '../api/models/input/login.input.model';
import { UserInfoInputModel } from '../api/models/input/user-info.input.model';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../settings/env/configuration';
import { LoginSuccessViewModel } from '../api/models/output/login-success.view.model';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { User } from '../../users/domain/user.entity';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { UuidProvider } from '../../../base/helpers/uuid.provider';
import { MailService } from '../../../base/mail/mail.service';
import { RegistrationConfirmationCodeModel } from '../api/models/input/registration-confirmation-code.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly uuidProvider: UuidProvider,
    private readonly mailService: MailService,
  ) {}

  async validateUser(loginInput: LoginInputModel): Promise<string | null> {
    const { loginOrEmail, password } = loginInput;
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await this.bcryptService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user._id.toString();
  }

  async login(userId: UserInfoInputModel): Promise<LoginSuccessViewModel> {
    const payload = { userId: userId };
    const accessToken = this.jwtService.sign(payload);
    const apiSettings = this.configService.get('apiSettings', {
      infer: true,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: apiSettings.REFRESH_TOKEN_SECRET,
      expiresIn: apiSettings.REFRESH_TOKEN_EXPIRATION,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async registerUser(userCreateModel: UserCreateModel) {
    const existingUserByLogin = await this.usersRepository.findByLoginOrEmail(
      userCreateModel.login,
    );
    if (existingUserByLogin) {
      throw new BadRequestException([
        { field: 'login', message: 'Login is not unique' },
      ]);
    }
    const existingUserByEmail = await this.usersRepository.findByLoginOrEmail(
      userCreateModel.email,
    );
    if (existingUserByEmail) {
      throw new BadRequestException([
        { field: 'email', message: 'Email is not unique' },
      ]);
    }
    const passHash = await this.bcryptService.generateHash(
      userCreateModel.password,
    );
    const expirationTime = this.configService.get(
      'apiSettings.CONFIRMATION_CODE_EXPIRATION',
      {
        infer: true,
      },
    );
    const newUser: User = {
      login: userCreateModel.login,
      password: passHash,
      email: userCreateModel.email,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: this.uuidProvider.generate(),
        expirationDate: new Date(new Date().getTime() + expirationTime),
        isConfirmed: false,
      },
    };
    await this.usersRepository.create(newUser);
    await this.mailService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
    );
  }

  async confirmationRegistrationUser(
    inputCode: RegistrationConfirmationCodeModel,
  ) {
    const confirmedUser =
      await this.usersRepository.findByConfirmationCode(inputCode);
    if (!confirmedUser) {
      throw new BadRequestException([
        { field: 'code', message: 'Confirmation code is incorrect' },
      ]);
    }
    const isConfirmed = true;
    await this.usersRepository.updateEmailConfirmation(
      confirmedUser.id,
      isConfirmed,
    );
  }
}
