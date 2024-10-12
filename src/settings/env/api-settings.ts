import { EnvironmentVariable } from './configuration';
import { IsNumber, IsString } from 'class-validator';

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsNumber()
  PORT: number = Number(this.environmentVariables.PORT);
  @IsString()
  ADMIN_LOGIN: string = this.environmentVariables.ADMIN_LOGIN;
  @IsString()
  ADMIN_PASSWORD: string = this.environmentVariables.ADMIN_PASSWORD;
  PATH = {
    USERS: this.environmentVariables.USERS_PATH,
    BLOGS: this.environmentVariables.BLOGS_PATH,
    POSTS: this.environmentVariables.POSTS_PATH,
    TESTING: this.environmentVariables.TESTING_PATH,
  };
}
