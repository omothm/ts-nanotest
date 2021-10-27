import assert from 'assert';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestRunner from '../src/impl/runner';

const testNameA = 'example A test';
const testNameB = 'example B test';

export default async function testRunner_manySuites(): Promise<void> {

  const runner = new TestRunner();
  const testSuites = [TestSuiteStub1, TestSuiteStub2];

  const report = await runner.run(testSuites);

  assert.equal(report.suites.length, 2);
  assert.equal(report.suites[0].name, TestSuiteStub1.name);
  assert.equal(report.suites[0].tests.length, 1);
  assert.equal(report.suites[0].tests[0].name, testNameA);
  assert.equal(report.suites[1].name, TestSuiteStub2.name);
  assert.equal(report.suites[1].tests.length, 1);
  assert.equal(report.suites[1].tests[0].name, testNameB);
}

class TestSuiteStub1 extends TestSuite {

  tests(): TestSpecs {
    return {
      [testNameA]: () => {
        // dummy
      },
    };
  }
}

class TestSuiteStub2 extends TestSuite {

  tests(): TestSpecs {
    return {
      [testNameB]: () => {
        // dummy
      },
    };
  }
}
