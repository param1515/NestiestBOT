// api-key.service.ts

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ApiKeyService {
  private readonly filePath = 'apiKeys.json';

  storeApiKey(apiKey: string): void {
    try {
      const jsonData = { apiKey }; // Creating JSON data

      // Write the JSON data to a file named 'apiKeys.json'
      fs.writeFileSync(this.filePath, JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error storing API key:', error);
      throw new Error('Failed to store API key');
    }
  }
}
