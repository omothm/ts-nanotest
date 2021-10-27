import assert from 'assert';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testName = 'example test';

export default async function testRunner_singleSuite_singleTest_pass(): Promise<void> {

  const runner = new TestRunner();
  const testSuites = [TestSuiteSpy];
  TestSuiteSpy.testCalled = false;

  const report = await runner.run(testSuites);

  assert.equal(report.suites.length, 1);
  assert.equal(report.suites[0].name, TestSuiteSpy.name);
  assert.equal(report.suites[0].tests.length, 1);
  assert.equal(report.suites[0].tests[0].name, testName);
  assert.equal(report.suites[0].tests[0].error, null);
  assert.ok(TestSuiteSpy.testCalled);
}

class TestSuiteSpy extends TestSuite {

  static testCalled = false;

  tests(): TestSpecs {
    return {
      [testName]: () => {
        TestSuiteSpy.testCalled = true;
      },
    };
  }
}
