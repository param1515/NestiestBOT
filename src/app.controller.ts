// Inside your AppController
import { Get, Controller, Render } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';

@Controller()
export class AppController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world' };
  }
  @Get('admin') // Define a route for the admin page
  @Render('admin-page') // Assuming 'admin-page' is the name of the admin view/template
  async adminPage() {
    const subscribers = Array.from(this.telegramService.getSubscribers()); // Convert set to array for rendering
    return { subscribers }; // Pass subscribers data to the admin page
  }
}

