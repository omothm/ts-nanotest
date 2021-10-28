import assert, { AssertionError } from 'assert';
import TestReporter from '../src/core/reporter';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testName = 'example test';

export default async function testRunner_singleSuite_singleTest_fail(): Promise<void> {

  const reporter = new TestReporter();
  const runner = new TestRunner(reporter);
  const testSuites = [TestSuiteStub];

  await runner.run(testSuites);

  const report = reporter.getReport();

  assert.equal(report.length, 1);
  assert.equal(report[0].suite, TestSuiteStub.name);
  assert.equal(report[0].test, testName);
  assert.ok(report[0].error instanceof AssertionError);
}

class TestSuiteStub extends TestSuite {

  override tests(): TestSpecs {
    return {
      [testName]: () => {
        assert.equal(1, 2);
      },
    };
  }
}
