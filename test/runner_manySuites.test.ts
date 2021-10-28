import assert from 'assert';
import TestReporter from '../src/core/reporter';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testNameA = 'example A test';
const testNameB = 'example B test';

export default async function testRunner_manySuites(): Promise<void> {

  const reporter = new TestReporter();
  const runner = new TestRunner(reporter);
  const testSuites = [TestSuiteStub1, TestSuiteStub2];

  await runner.run(testSuites);

  const report = reporter.getReport();

  assert.equal(report.length, 2);
  assert.equal(report[0].suite, TestSuiteStub1.name);
  assert.equal(report[0].test, testNameA);
  assert.equal(report[1].suite, TestSuiteStub2.name);
  assert.equal(report[1].test, testNameB);
}

class TestSuiteStub1 extends TestSuite {

  override tests(): TestSpecs {
    return {
      [testNameA]: () => {
        // dummy
      },
    };
  }
}

class TestSuiteStub2 extends TestSuite {

  override tests(): TestSpecs {
    return {
      [testNameB]: () => {
        // dummy
      },
    };
  }
}
