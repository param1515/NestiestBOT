import { Module } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ApiController } from './api.controller';
import { ApiKeyService } from './api-key.service'; 
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TelegramService } from './telegram/telegram.service';


@Module({
  imports: [TelegramModule],
  controllers: [AppController],
  providers: [AppService,TelegramService],
})

export class AppModule {}

