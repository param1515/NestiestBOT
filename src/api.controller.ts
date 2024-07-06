// api.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  getApiInfo(): { message: string } {
    return { message: 'Welcome to the API endpoint!' };
  }

  @Post('storeApiKey')
  storeApiKey(@Body() body: { apiKey: string }): { message: string } {
    try {
      console.log('Received API key:', body.apiKey);
      return { message: 'API key stored successfully' };
    } catch (error) {
      throw new Error('Failed to store API key');
    }
  }
}
