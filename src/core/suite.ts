import TestCase from './case';

export default abstract class TestSuite {

  beforeEach(): void | Promise<void> {
    return;
  }

  afterEach(): void | Promise<void> {
    return;
  }

  beforeAll(): void | Promise<void> {
    return;
  }

  afterAll(): void | Promise<void> {
    return;
  }

  abstract tests(): TestCase[];

  test(
    name: string,
    run: () => void | Promise<void>,
    options?: Omit<TestCase, 'name' | 'run'>,
  ): TestCase {
    return {
      name,
      run,
      ...options,
    };
  }

  skip(
    name: string,
    run: () => void | Promise<void>,
    options?: Omit<TestCase, 'name' | 'run' | 'skip'>,
  ): TestCase {
    return this.test(name, run, { ...options, skip: true });
  }
}
