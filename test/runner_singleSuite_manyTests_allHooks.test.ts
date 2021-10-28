import assert from 'assert';
import TestReporter from '../src/core/reporter';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testNames = ['test 1', 'test 2'];

export default async function testRunner_singleSuite_manyTests_allHooks(): Promise<void> {
  const reporter = new TestReporter();
  const runner = new TestRunner(reporter);
  const testClasses = [TestSuiteSpy];
  TestSuiteSpy.testOrder = [];

  await runner.run(testClasses);

  const report = reporter.getReport();

  assert.equal(report.length, 2);
  assert.equal(report[0].suite, TestSuiteSpy.name);
  assert.equal(report[0].test, testNames[0]);
  assert.equal(report[0].error, null);
  assert.equal(report[1].suite, TestSuiteSpy.name);
  assert.equal(report[1].test, testNames[1]);
  assert.equal(report[1].error, null);
  assert.equal(
    TestSuiteSpy.testOrder.join(','),
    ['ba', 'be', 't1', 'ae', 'be', 't2', 'ae', 'aa'].join(','),
  );
}

class TestSuiteSpy extends TestSuite {

  static testOrder: string[] = [];

  override beforeAll() {
    TestSuiteSpy.testOrder.push('ba');
  }

  override afterAll() {
    TestSuiteSpy.testOrder.push('aa');
  }

  override beforeEach() {
    TestSuiteSpy.testOrder.push('be');
  }

  override afterEach() {
    TestSuiteSpy.testOrder.push('ae');
  }

  override tests(): TestSpecs {
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
