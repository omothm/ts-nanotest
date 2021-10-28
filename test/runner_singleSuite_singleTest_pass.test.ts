import assert from 'assert';
import TestReporter from '../src/core/reporter';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testName = 'example test';

export default async function testRunner_singleSuite_singleTest_pass(): Promise<void> {

  const reporter = new TestReporter();
  const runner = new TestRunner(reporter);
  const testSuites = [TestSuiteSpy];
  TestSuiteSpy.testCalled = false;

  await runner.run(testSuites);

  const report = reporter.getReport();

  assert.equal(report.length, 1);
  assert.equal(report[0].suite, TestSuiteSpy.name);
  assert.equal(report[0].test, testName);
  assert.equal(report[0].error, null);
  assert.ok(TestSuiteSpy.testCalled);
}

class TestSuiteSpy extends TestSuite {

  static testCalled = false;

  override tests(): TestSpecs {
    return {
      [testName]: () => {
        TestSuiteSpy.testCalled = true;
      },
    };
  }
}
