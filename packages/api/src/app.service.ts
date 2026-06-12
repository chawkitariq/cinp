import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns the default health-style greeting for the root route.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
