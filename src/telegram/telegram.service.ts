import { Injectable, Logger, Post, Body, Delete, Param, Get } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');
const TELEGRAM_TOKEN = "6866553272:AAEcogf6vdWj9BJCyu9Ei8l2lqJx_hurMBQ"
const apiKey = '3df8eac468e248fa833210648232912';
import axios from 'axios';
const fs = require('fs');
const path = require('path');

interface Subscriber {
  userId: string;
  firstname: string;
}

@Injectable()
export class TelegramService {
  private readonly bot: any;
  private subscribers: Set<Subscriber> = new Set<Subscriber>();
  private readonly subscribersFilePath = path.join(__dirname, 'subscribers.json');
  private logger = new Logger(TelegramService.name);
  private lastUpdated: number = 0;

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    this.bot.on("message", this.onReceiveMessage.bind(this));
    this.loadSubscribersFromFile();
    this.startFileSyncCheck();
  }

  async onReceiveMessage(msg: any) {
    if (msg.text && msg.text.toLowerCase() === '/subscribe') {
      const userId = msg.chat.id;
      const firstname = msg.chat.first_name;
      const isSubscribed = this.isSubscribed(userId);
      if (!isSubscribed) {
        this.subscribers.add({ userId, firstname });
        this.saveSubscribersToFile();
        this.sendMessageToUser(userId, 'You have been subscribed!');
      } else {
        this.sendMessageToUser(userId, 'You are already subscribed.');
      }
    } else if (msg.text && msg.text.toLowerCase() === '/unsubscribe') {
      const userId = msg.chat.id;
      const isSubscribed = this.isSubscribed(userId);
      if (isSubscribed) {
        this.unsubscribe(userId);
        this.saveSubscribersToFile();
        this.sendMessageToUser(userId, 'You have been unsubscribed!');
      } else {
        this.sendMessageToUser(userId, 'You are not subscribed.');
      }
    } else if (msg.text && msg.text.toLowerCase() === '/weather') {
      const userId = msg.chat.id;
      const isSubscribed = this.isSubscribed(userId);
      if (isSubscribed) {
        try {
          const weatherData = await this.getWeatherData('Delhi'); // Replace 'YourCity' with the desired city
          this.sendMessageToUser(userId, `Weather Update: ${weatherData.description}, Temperature: ${weatherData.temperature}`);
        } catch (error) {
          this.sendMessageToUser(userId, 'Failed to fetch weather data.');
          console.error('Error fetching weather data:', error);
        }
      } else {
        this.sendMessageToUser(userId, 'You are not subscribed. Please subscribe to receive weather updates.');
      }
    }
  }

  sendMessageToUser = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  }

  async getWeatherData(city: string) {
    const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    try {
      const response = await axios.get(weatherApiUrl);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error}`);
    }
  }

  loadSubscribersFromFile() {
    try {
      const fileStats = fs.statSync(this.subscribersFilePath);
      const currentModifiedTime = fileStats.mtimeMs;

      if (currentModifiedTime > this.lastUpdated) {
        const subscribersData = fs.readFileSync(this.subscribersFilePath, 'utf-8');
        this.subscribers = new Set<Subscriber>(JSON.parse(subscribersData));
        this.lastUpdated = currentModifiedTime;
      }
    } catch (error) {
      this.logger.error('Error reading subscribers file:', error);
      this.subscribers = new Set<Subscriber>();
    }
  }

  saveSubscribersToFile() {
    try {
      fs.writeFileSync(this.subscribersFilePath, JSON.stringify(Array.from(this.subscribers)), 'utf-8');
      this.lastUpdated = Date.now();
    } catch (error) {
      this.logger.error('Error writing subscribers file:', error);
    }
  }

  startFileSyncCheck() {
    setInterval(() => {
      this.loadSubscribersFromFile();
    }, 5000);
  }

  unsubscribe(userId: string): void {
    this.subscribers.forEach((subscriber, index) => {
      if (subscriber.userId === userId) {
        this.subscribers.delete(subscriber);
        return;
      }
    });
  }

  isSubscribed(userId: string): boolean {
    return Array.from(this.subscribers).some(subscriber => subscriber.userId === userId);
  }
  getSubscribers(): Set<Subscriber> {
    return this.subscribers;
  }
  addSubscriber(subscriber: Subscriber): void {
    this.subscribers.add(subscriber);
  }
}