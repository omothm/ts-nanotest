import assert from 'assert';
import { TestSpecs, TestSuite } from '../src/core/suite';

export function createPassingSuite(testName: string): new () => TestSuite {
  return class extends TestSuite {
    tests(): TestSpecs {
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
    tests(): TestSpecs {
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

    tests(): TestSpecs {
      const specs: TestSpecs = {};
      for (const testName of testNames) {
        specs[testName] = () => {
          callOrder.push(testName);
        };
      }
      return specs;
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

    tests(): TestSpecs {
      const specs: TestSpecs = {};
      for (const testName of testNames) {
        specs[testName] = () => {
          throw new Error();
        };
      }
      return specs;
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

    tests(): TestSpecs {
      return {
        test: () => {
          // pass
        },
      };
    }
  };
}
