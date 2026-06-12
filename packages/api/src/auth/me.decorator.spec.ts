import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Me } from './me.decorator';
import { User } from 'src/user/entities/user.entity';

describe('Me decorator', () => {
  it('extracts the authenticated user from the request', () => {
    expect(invokeMeDecorator()).toEqual(
      expect.objectContaining({
        id: 'user-id',
        email: 'user@example.com',
        isRecruiter: true,
      }),
    );
  });

  it('extracts a selected authenticated user property', () => {
    expect(invokeMeDecorator('email')).toBe('user@example.com');
  });

  function invokeMeDecorator(data?: string) {
    const factory = getDecoratorFactory();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 'user-id',
            email: 'user@example.com',
            isRecruiter: true,
          } as User,
        }),
      }),
    } as ExecutionContext;

    return factory(data, context);
  }

  function getDecoratorFactory() {
    class TestController {
      test(@Me() user: unknown) {
        return user;
      }
    }

    const metadata = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      TestController,
      'test',
    ) as Record<
      string,
      { factory: (data: unknown, ctx: ExecutionContext) => unknown }
    >;
    const [metadataValue] = Object.values(metadata);

    return metadataValue.factory;
  }
});
