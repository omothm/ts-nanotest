import assert from 'assert';
import { TestCase, TestSuite } from '../../src';

export function createPassingSuite(testName: string): new () => TestSuite {
  return class extends TestSuite {
    tests(): TestCase[] {
      return [
        this.test(testName || 'test', () => {
          // pass
        }),
      ];
    }
  };
}

export function createFailingSuite(testName: string): new () => TestSuite {
  return class extends TestSuite {
    tests(): TestCase[] {
      return [
        this.test(testName || 'test', () => {
          assert.equal(1, 2);
        }),
      ];
    }
  };
}

export function createAllHookSuiteSpy(
  hookNames: { beforeAll?: string; beforeEach?: string; afterEach?: string; afterAll?: string },
  testNames: string[],
): { suite: new () => TestSuite; callOrder: string[] } {

  const callOrder: string[] = [];

  class TestSuiteSpy extends TestSuite {

    beforeAll() {
      if (hookNames.beforeAll) {
        callOrder.push(hookNames.beforeAll);
      }
    }

    afterAll() {
      if (hookNames.afterAll) {
        callOrder.push(hookNames.afterAll);
      }
    }

    beforeEach() {
      if (hookNames.beforeEach) {
        callOrder.push(hookNames.beforeEach);
      }
    }

    afterEach() {
      if (hookNames.afterEach) {
        callOrder.push(hookNames.afterEach);
      }
    }

    tests(): TestCase[] {
      const cases: TestCase[] = [];
      for (const testName of testNames) {
        cases.push(this.test(testName, () => {
          callOrder.push(testName);
        }));
      }
      return cases;
    }
  }

  return { suite: TestSuiteSpy, callOrder };
}

export function createSuiteSpyWithFailingTestsAndAfterHooks(
  afterEach: string,
  afterAll: string,
  testNames: string[],
): { suite: new () => TestSuite; callOrder: string[] } {

  const callOrder: string[] = [];

  class TestSuiteSpy extends TestSuite {

    afterEach() {
      callOrder.push(afterEach);
    }

    afterAll() {
      callOrder.push(afterAll);
    }

    tests(): TestCase[] {
      const cases: TestCase[] = [];
      for (const testName of testNames) {
        cases.push(this.test(testName, () => {
          throw new Error();
        }));
      }
      return cases;
    }
  }

  return { suite: TestSuiteSpy, callOrder };
}

export function createSuiteWithFailingHook(
  failingHook: 'beforeAll' | 'afterAll' | 'beforeEach' | 'afterEach',
): new () => TestSuite {

  return class extends TestSuite {

    beforeAll() {
      if (failingHook === 'beforeAll') {
        throw new Error();
      }
    }

    afterAll() {
      if (failingHook === 'afterAll') {
        throw new Error();
      }
    }

    beforeEach() {
      if (failingHook === 'beforeEach') {
        throw new Error();
      }
    }

    afterEach() {
      if (failingHook === 'afterEach') {
        throw new Error();
      }
    }

    tests(): TestCase[] {
      return [
        this.test('test', () => {
          // pass
        }),
      ];
    }
  };
}

export function createSuiteWithSkippedTest(testName: string): new () => TestSuite {

  return class extends TestSuite {

    tests(): TestCase[] {
      return [
        this.skip(testName, () => {
          throw new Error('this should never be thrown');
        }),
      ];
    }
  };
}

export function createSuiteWithPassingTestAndSkippedTest(
  passingTestName: string,
  skippedTestName: string,
): new () => TestSuite {

  return class extends TestSuite {
    tests(): TestCase[] {
      return [
        this.test(passingTestName, () => {
          // pass
        }),
        this.skip(skippedTestName, () => {
          throw new Error('this should never be thrown');
        }),
      ];
    }
  };
}
