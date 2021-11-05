import assert from 'assert';
import { TestCases, TestSuite } from '../../src';

export function createPassingSuite(testName: string): new () => TestSuite {
  return class extends TestSuite {
    tests(): TestCases {
      return {
        [testName || 'test']: () => {
          // pass
        },
      };
    }
  };
}

export function createFailingSuite(testName: string): new () => TestSuite {
  return class extends TestSuite {
    tests(): TestCases {
      return {
        [testName]: () => {
          assert.equal(1, 2);
        },
      };
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

    tests(): TestCases {
      const cases: TestCases = {};
      for (const testName of testNames) {
        cases[testName] = () => {
          callOrder.push(testName);
        };
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

    tests(): TestCases {
      const cases: TestCases = {};
      for (const testName of testNames) {
        cases[testName] = () => {
          throw new Error();
        };
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

    tests(): TestCases {
      return {
        test: () => {
          // pass
        },
      };
    }
  };
}
