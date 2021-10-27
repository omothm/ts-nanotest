import assert from 'assert';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testNames = ['test 1', 'test 2'];

export default async function testRunner_singleSuite_manyTests_allHooks(): Promise<void> {
  const runner = new TestRunner();
  const testClasses = [TestSuiteSpy];
  TestSuiteSpy.testOrder = [];

  const report = await runner.run(testClasses);

  assert.equal(report.suites.length, 1);
  assert.equal(report.suites[0].name, TestSuiteSpy.name);
  assert.equal(report.suites[0].tests.length, 2);
  assert.equal(report.suites[0].tests[0].name, testNames[0]);
  assert.equal(report.suites[0].tests[0].error, null);
  assert.equal(report.suites[0].tests[1].name, testNames[1]);
  assert.equal(report.suites[0].tests[1].error, null);
  assert.equal(
    TestSuiteSpy.testOrder.join(','),
    ['ba', 'be', 't1', 'ae', 'be', 't2', 'ae', 'aa'].join(','),
  );
}

class TestSuiteSpy extends TestSuite {

  static testOrder: string[] = [];

  beforeAll() {
    TestSuiteSpy.testOrder.push('ba');
  }

  afterAll() {
    TestSuiteSpy.testOrder.push('aa');
  }

  beforeEach() {
    TestSuiteSpy.testOrder.push('be');
  }

  afterEach() {
    TestSuiteSpy.testOrder.push('ae');
  }

  tests(): TestSpecs {
    return {
      [testNames[0]]: () => {
        TestSuiteSpy.testOrder.push('t1');
      },
      [testNames[1]]: () => {
        TestSuiteSpy.testOrder.push('t2');
      },
    };
  }
}
