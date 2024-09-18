import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/config';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(appSettings.getMongoUrl()),
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
