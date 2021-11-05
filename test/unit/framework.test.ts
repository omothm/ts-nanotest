import assert, { AssertionError } from 'assert';
import ClassLoader from '../../src/core/classLoader';
import DirectoryReader from '../../src/core/directoryReader';
import { ClassLoadError, NoTestSuitesError } from '../../src/errors';
import TestReporter from '../../src/impl/reporter';
import { TestSuite } from '../../src';
import TestFramework from '../../src/impl/framework';
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
  return new FrameworkProxy({});
}

function createFrameworkThatFailsToLoadClass() {
  return new FrameworkProxy({ file: null });
}

function createFramework(suiteClasses: { [file: string]: new () => TestSuite }) {
  return new FrameworkProxy(suiteClasses);
}

class FrameworkProxy {

  private framework: TestFramework;
  private reporter: TestReporter;

  constructor(suiteClasses: { [file: string]: (new () => TestSuite) | null }) {

    const directoryReader = new DirectoryReaderStub(Object.keys(suiteClasses));
    const classLoader = new ClassLoaderStub(suiteClasses);
    this.reporter = new TestReporter();
    this.framework = new TestFramework(directoryReader, classLoader, this.reporter);
  }

  async runTestsAndGetReport(): Promise<TestReport[]> {
    await this.framework.test([]);
    return this.reporter.getReport();
  }
}

class DirectoryReaderStub implements DirectoryReader {

  constructor(private testFiles: string[]) { }

  read(_globPatterns: string[]): string[] {
    return this.testFiles;
  }
}

class ClassLoaderStub implements ClassLoader {

  constructor(private suiteClasses: { [file: string]: (new () => TestSuite) | null }) { }

  load(filepath: string): Promise<new () => TestSuite> {
    const suiteClass = this.suiteClasses[filepath];
    if (!(suiteClass instanceof Function)) {
      throw new ClassLoadError();
    }
    return Promise.resolve(suiteClass);
  }
}

interface TestReport {
  suite: string;
  test: string;
  error: Error | null;
}
