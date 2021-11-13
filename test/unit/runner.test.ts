import assert, { AssertionError } from 'assert';
import { HookError, NoTestSuitesError } from '../../src/errors';
import TestReporter from '../../src/impl/reporter';
import { TestSuite } from '../../src';
import TestRunner from '../../src/impl/runner';
import {
  createAllHookSuiteSpy, createFailingSuite, createPassingSuite,
  createSuiteSpyWithFailingTestsAndAfterHooks, createSuiteWithFailingHook,
  createSuiteWithPassingTestAndSkippedTest, createSuiteWithSkippedTest,
} from './common';

export default [

  async function testRunner_noSuites(): Promise<void> {

    const runner = new TestRunnerProxy([]);

    await assert.rejects(async () => {
      await runner.runAndGetReport();
    }, NoTestSuitesError);
  },

  async function testRunner_singleSuite_singleTest_pass(): Promise<void> {

    const testName = 'passing test';
    const passingSuite = createPassingSuite(testName);
    const runner = new TestRunnerProxy([passingSuite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 1);
    assert.equal(report[0].suite, passingSuite.name);
    assert.equal(report[0].test, testName);
    assert.equal(report[0].error, null);
  },

  async function testRunner_singleSuite_singleTest_fail(): Promise<void> {

    const testName = 'failing test';
    const failingSuite = createFailingSuite(testName);
    const runner = new TestRunnerProxy([failingSuite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 1);
    assert.equal(report[0].suite, failingSuite.name);
    assert.equal(report[0].test, testName);
    assert.ok(report[0].error instanceof AssertionError);
  },

  async function testRunner_singleSuite_hookFail_beforeAll(): Promise<void> {

    const suite = createSuiteWithFailingHook('beforeAll');
    const runner = new TestRunnerProxy([suite]);

    await assert.rejects(async () => {
      await runner.runAndGetReport();
    }, HookError);
  },

  async function testRunner_singleSuite_hookFail_afterAll(): Promise<void> {

    const suite = createSuiteWithFailingHook('afterAll');
    const runner = new TestRunnerProxy([suite]);

    await assert.rejects(async () => {
      await runner.runAndGetReport();
    }, HookError);
  },

  async function testRunner_singleSuite_hookFail_beforeEach(): Promise<void> {

    const suite = createSuiteWithFailingHook('beforeEach');
    const runner = new TestRunnerProxy([suite]);

    await assert.rejects(async () => {
      await runner.runAndGetReport();
    }, HookError);
  },

  async function testRunner_singleSuite_hookFail_afterEach(): Promise<void> {

    const suite = createSuiteWithFailingHook('afterEach');
    const runner = new TestRunnerProxy([suite]);

    await assert.rejects(async () => {
      await runner.runAndGetReport();
    }, HookError);
  },

  async function testRunner_singleSuite_manyTests_allHooks(): Promise<void> {

    const beforeAll = 'ba';
    const beforeEach = 'be';
    const afterEach = 'ae';
    const afterAll = 'aa';
    const testNames = ['t1', 't2'];
    const { suite, callOrder } = createAllHookSuiteSpy(
      { beforeAll, beforeEach, afterEach, afterAll },
      testNames,
    );
    const runner = new TestRunnerProxy([suite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 2);
    assert.equal(report[0].suite, suite.name);
    assert.equal(report[0].test, testNames[0]);
    assert.equal(report[0].error, null);
    assert.equal(report[1].suite, suite.name);
    assert.equal(report[1].test, testNames[1]);
    assert.equal(report[1].error, null);
    assert.equal(
      callOrder.join(','),
      [
        beforeAll,
        beforeEach,
        testNames[0],
        afterEach,
        beforeEach,
        testNames[1],
        afterEach,
        afterAll,
      ].join(','),
    );
  },

  async function testRunner_singleSuite_manyTests_afterHooksAlwaysCalled(): Promise<void> {

    const afterEach = 'ae';
    const afterAll = 'aa';
    const testNames = ['t1', 't2'];
    const { suite, callOrder } = createSuiteSpyWithFailingTestsAndAfterHooks(
      afterEach, afterAll, testNames,
    );
    const runner = new TestRunnerProxy([suite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 2);
    assert.equal(report[0].suite, suite.name);
    assert.equal(report[0].test, testNames[0]);
    assert.ok(report[0].error != null);
    assert.equal(report[1].suite, suite.name);
    assert.equal(report[1].test, testNames[1]);
    assert.ok(report[1].error != null);
    assert.equal(callOrder.join(','), [afterEach, afterEach, afterAll].join(','));
  },

  async function testRunner_singleSuite_singleTest_skipped(): Promise<void> {

    const skippedTestName = 'skipped test';
    const suite = createSuiteWithSkippedTest(skippedTestName);
    const runner = new TestRunnerProxy([suite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 1);
    assert.equal(report[0].suite, suite.name);
    assert.equal(report[0].test, skippedTestName);
    assert.equal(report[0].skipped, true);
    assert.equal(report[0].error, null);
  },

  async function testRunner_singleSuite_manyTests_someSkipped(): Promise<void> {

    const passingTestName = 'passing test';
    const skippedTestName = 'skipped test';
    const suite = createSuiteWithPassingTestAndSkippedTest(passingTestName, skippedTestName);
    const runner = new TestRunnerProxy([suite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 2);
    assert.equal(report[0].suite, suite.name);
    assert.equal(report[0].test, passingTestName);
    assert.equal(report[0].skipped, false);
    assert.equal(report[0].error, null);
    assert.equal(report[1].suite, suite.name);
    assert.equal(report[1].test, skippedTestName);
    assert.equal(report[1].skipped, true);
    assert.equal(report[1].error, null);
  },

  async function testRunner_manySuites(): Promise<void> {

    const passingTestName = 'passing test';
    const passingSuite = createPassingSuite(passingTestName);
    const failingTestName = 'failing test';
    const failingSuite = createFailingSuite(failingTestName);
    const runner = new TestRunnerProxy([passingSuite, failingSuite]);

    const report = await runner.runAndGetReport();

    assert.equal(report.length, 2);
    assert.equal(report[0].suite, passingSuite.name);
    assert.equal(report[0].test, passingTestName);
    assert.equal(report[1].suite, failingSuite.name);
    assert.equal(report[1].test, failingTestName);
  },

];

class TestRunnerProxy {

  private runner: TestRunner;
  private reporter: TestReporter;

  constructor(private suiteClasses: (new () => TestSuite)[]) {
    this.reporter = new TestReporter();
    this.runner = new TestRunner(this.reporter);
  }

  async runAndGetReport(): Promise<TestReport[]> {
    await this.runner.run(this.suiteClasses);
    return this.reporter.getReport();
  }
}

interface TestReport {
  suite: string;
  test: string;
  skipped: boolean;
  error: Error | null;
}
