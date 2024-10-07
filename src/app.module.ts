import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { TestingModule } from './features/testing/testing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigurationType } from './settings/env/configuration';
import { validate } from './settings/env/configuration';
import process from 'process';
import { Environments } from './settings/env/env-settings';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/bloggers-platform/blogs.module';

@Module({
  imports: [
    TestingModule,
    UsersModule,
    BlogsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      ignoreEnvFile:
        process.env.ENV !== Environments.DEVELOPMENT &&
        process.env.ENV !== Environments.TESTING,
      envFilePath: ['.env.test.local', '.env.development', '.env'],
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const environmentSettings = configService.get('environmentSettings', {
          infer: true,
        });
        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        });

        const uri = environmentSettings.isTesting
          ? databaseSettings.MONGO_URL_FOR_TESTS
          : databaseSettings.MONGO_URL;
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
