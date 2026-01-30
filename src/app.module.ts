import { join } from 'path';

import mongoose from 'mongoose';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from 'src/api/auth/auth.module';
import { UserModule } from 'src/api/user/user.module';
import { ArticleModule } from 'src/api/article/article.module';
import { CommentModule } from 'src/api/comment/comment.module';
import { FileModule } from 'src/api/file/file.module';
import { TagModule } from 'src/api/tag/tag.module';
import { FileStorageModule } from 'src/api/file-storage/file-storage.module';

mongoose.set('debug', true); /** @warning - enabled mongoose debug mode */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_DB_URL'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage'),
      serveRoot: '/storage/',
    }),
    FileModule,
    AuthModule,
    UserModule,
    ArticleModule,
    CommentModule,
    TagModule,
    FileStorageModule,
  ],
})
export class AppModule {}
