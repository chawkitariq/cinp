import { IS_PUBLIC_KEY, Public } from './public.decorator';

describe('Public decorator', () => {
  it('sets public route metadata', () => {
    class TestController {
      @Public()
      test() {}
    }
    const descriptor = Object.getOwnPropertyDescriptor(
      TestController.prototype,
      'test',
    );

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value)).toBe(true);
  });
});
