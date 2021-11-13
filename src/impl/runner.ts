import { HookError, NoTestSuitesError } from '../errors';
import TestSuite from '../core/suite';
import TestReporter from './reporter';

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

      try {
        await suite.beforeAll();
      } catch (err) {
        throw new HookError(hookErrorMessage('beforeAll', suiteClass.name, null, err));
      }

      for (const test of tests) {

        if (test.skip) {
          this.reporter.add({
            suite: suiteClass.name,
            test: test.name,
            skipped: true,
            error: null,
          });
          continue;
        }

        try {
          await suite.beforeEach();
        } catch (err) {
          throw new HookError(hookErrorMessage('beforeEach', suiteClass.name, test.name, err));
        }

        try {

          await test.run();

          this.reporter.add({
            suite: suiteClass.name,
            test: test.name,
            skipped: false,
            error: null,
          });

        } catch (err) {

          this.reporter.add({
            suite: suiteClass.name,
            test: test.name,
            skipped: false,
            error: err as Error,
          });

        }

        try {
          await suite.afterEach();
        } catch (err) {
          throw new HookError(hookErrorMessage('afterEach', suiteClass.name, test.name, err));
        }

      }

      try {
        await suite.afterAll();
      } catch (err) {
        throw new HookError(hookErrorMessage('afterAll', suiteClass.name, null, err));
      }
    }

    this.reporter.end();
  }
}

function hookErrorMessage(
  hook: 'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll',
  suite: string,
  test: string | null,
  error: unknown,
) {
  const errorString = error instanceof Error
    ? error.stack || error.message
    : (error as object).toString();
  const testName = `${suite}${test ? `/${test}` : ''}`;
  return `${hook} hook errored in ${testName}\n${errorString}`;
}
