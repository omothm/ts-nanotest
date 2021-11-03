import { NoTestSuitesError } from '../core/errors';
import { TestSuite } from '../core/suite';
import TestReporter from '../core/reporter';

export default class TestRunner {

  constructor(private reporter: TestReporter) { }

  async run(classes: (new () => TestSuite)[]): Promise<void> {

    if (!classes.length) {
      throw new NoTestSuitesError();
    }

    this.reporter.begin();

    for (const suiteClass of classes) {
      const suite = new suiteClass();
      const tests = suite.tests();

      await suite.beforeAll();

      for (const [testName, testFunction] of Object.entries(tests)) {

        await suite.beforeEach();

        try {

          await testFunction();

          this.reporter.add({
            suite: suiteClass.name,
            test: testName,
            error: null,
          });

        } catch (err) {

          this.reporter.add({
            suite: suiteClass.name,
            test: testName,
            error: err as Error,
          });

        }

        await suite.afterEach();
      }

      await suite.afterAll();
    }

    this.reporter.end();
  }
}
