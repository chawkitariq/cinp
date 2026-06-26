import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns the default health-style greeting for the root route.
   *
   * @returns The API greeting string.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
