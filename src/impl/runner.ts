import TestError from '../core/error';
import { SuiteResult, TestReport } from '../core/report';
import { TestSuite } from '../core/suite';

export default class TestRunner {

  async run(classes: (new () => TestSuite)[]): Promise<TestReport> {

    if (!classes.length) {
      throw new TestError('No test suites found');
    }

    const report: TestReport = { suites: [] };

    for (const suiteClass of classes) {
      const suite = new suiteClass();
      const tests = suite.tests();
      const suiteResult: SuiteResult = {
        name: suiteClass.name,
        tests: [],
      };

      await suite.beforeAll();

      for (const [testName, testFunction] of Object.entries(tests)) {

        await suite.beforeEach();

        try {

          await testFunction();

          suiteResult.tests.push({
            name: testName,
            error: null,
          });

        } catch (err) {
          suiteResult.tests.push({
            name: testName,
            error: err as Error,
          });
        }

        await suite.afterEach();
      }

      await suite.afterAll();

      report.suites.push(suiteResult);
    }

    return report;
  }
}
