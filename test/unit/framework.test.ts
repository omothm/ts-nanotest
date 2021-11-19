import assert, { AssertionError } from 'assert';
import { ClassLoadError, NoTestSuitesError } from '../../src/errors';
import { TestSuite } from '../../src';
import FrameworkProxy from '../common/framework';
import { createFailingSuite, createPassingSuite } from './common';

export default [

  async function testFramework_noFiles(): Promise<void> {
    const framework = createFrameworkThatDetectsNoFiles();

    await assert.rejects(async () => {
      await framework.runTestsAndGetReport();
    }, NoTestSuitesError);
  },

  async function testFramework_classLoadFail(): Promise<void> {
    const framework = createFrameworkThatFailsToLoadClass();

    await assert.rejects(async () => {
      await framework.runTestsAndGetReport();
    }, ClassLoadError);
  },

  async function testFramework_singleSuite(): Promise<void> {
    const passingTestName = 'passing test';
    const passingSuite = createPassingSuite(passingTestName);
    const framework = createFramework({ passingSuite });

    const report = await framework.runTestsAndGetReport();

    assert.equal(report.length, 1);
    assert.equal(report[0].suite, passingSuite.name);
    assert.equal(report[0].test, passingTestName);
    assert.equal(report[0].error, null);
  },

  async function testFramework_manySuites(): Promise<void> {
    const passingTestName = 'passing test';
    const passingSuite = createPassingSuite(passingTestName);
    const failingTestName = 'failing test';
    const failingSuite = createFailingSuite(failingTestName);
    const framework = createFramework({ passingSuite, failingSuite });

    const report = await framework.runTestsAndGetReport();

    assert.equal(report.length, 2);
    assert.equal(report[0].suite, passingSuite.name);
    assert.equal(report[0].test, passingTestName);
    assert.equal(report[0].error, null);
    assert.equal(report[1].suite, failingSuite.name);
    assert.equal(report[1].test, failingTestName);
    assert.ok(report[1].error instanceof AssertionError);
  },

];

function createFrameworkThatDetectsNoFiles() {
  return createFramework({});
}

function createFrameworkThatFailsToLoadClass() {
  return createFramework({ file: null });
}

function createFramework(suiteClasses: { [file: string]: (new () => TestSuite) | null }) {
  return new FrameworkProxy(suiteClasses);
}
