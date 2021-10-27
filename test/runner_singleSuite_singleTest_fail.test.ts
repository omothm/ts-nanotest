import assert, { AssertionError } from 'assert';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testName = 'example test';

export default async function testRunner_singleSuite_singleTest_fail(): Promise<void> {

  const runner = new TestRunner();
  const testSuites = [TestSuiteStub];

  const report = await runner.run(testSuites);

  assert.equal(report.suites.length, 1);
  assert.equal(report.suites[0].name, TestSuiteStub.name);
  assert.equal(report.suites[0].tests.length, 1);
  assert.equal(report.suites[0].tests[0].name, testName);
  assert.ok(report.suites[0].tests[0].error instanceof AssertionError);
}

class TestSuiteStub extends TestSuite {

  tests(): TestSpecs {
    return {
      [testName]: () => {
        assert.equal(1, 2);
      },
    };
  }
}
