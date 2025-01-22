import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../../tests-managers/users-test.manager';
import { initSettings } from '../../helpers/init-settings';
import { deleteAllData } from '../../helpers/delete-all-data';
import { UserCreateModel } from '../../../src/features/user-accounts/users/api/models/input/create-user.input.model';
import {
  createInValidUserModel,
  createValidUserModel,
} from '../../models/user-accounts/user.input.model';
import { AuthTestManager } from '../../tests-managers/auth-test.manager';

describe('e2e-Auth', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let authTestManager: AuthTestManager;
  beforeEach(async () => {
    const result = await initSettings();
    app = result.app;
    const coreConfig = result.coreConfig;
    usersTestManager = new UsersTestManager(app, coreConfig);
    authTestManager = new AuthTestManager(app, coreConfig);
  });
  beforeEach(async () => {
    await deleteAllData(app);
  });
  afterEach(async () => {
    await deleteAllData(app);
  });
  afterAll(async () => {
    await app.close();
  });
  describe('POST/auth/login', () => {
    it(`should login user to the system : STATUS 200`, async () => {
      const validUserModel: UserCreateModel = createValidUserModel();
      await usersTestManager.createUser(validUserModel);
      const createdResponse = await authTestManager.loginUser(
        validUserModel,
        HttpStatus.OK,
      );
      // console.log(createdResponse.accessToken);
      // console.log(createdResponse.refreshToken);
      authTestManager.expectCorrectLoginUser(createdResponse);
    });
    it(`shouldn't login user to the system if the password or login is wrong : STATUS 401`, async () => {
      const validUserModel: UserCreateModel = createValidUserModel();
      await usersTestManager.createUser(validUserModel);
      const invalidUserModel: UserCreateModel = createInValidUserModel();
      await authTestManager.logInNonExistentUser(
        invalidUserModel,
        HttpStatus.UNAUTHORIZED,
      );
    });

    it(`should restrict login if the limit is exceeded : STATUS 429`, async () => {
      const validUserModel: UserCreateModel = createValidUserModel();
      await usersTestManager.createUser(validUserModel);
      const createdResponse =
        await authTestManager.loginWithRateLimit(validUserModel);
      console.log(createdResponse);
      authTestManager.expectTooManyRequests(createdResponse);
    });
  });
});
