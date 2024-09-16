import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/config';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(appSettings.getMongoUrl()),
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
