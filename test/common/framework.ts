import { TestSuite } from '../../src';
import ClassLoader from '../../src/core/classLoader';
import DirectoryReader from '../../src/core/directoryReader';
import { ClassLoadError } from '../../src/errors';
import TestFramework from '../../src/impl/framework';
import TestReporter from '../../src/impl/reporter';

export default class FrameworkProxy {

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
  skipped: boolean;
  error: Error | null;
}
