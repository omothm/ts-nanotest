import TestCases from './cases';

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

  abstract tests(): TestCases;
}
