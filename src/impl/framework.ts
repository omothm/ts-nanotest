import ClassLoader from '../core/classLoader';
import DirectoryReader from '../core/directoryReader';
import TestReporter from '../core/reporter';
import { TestSuite } from '../core/suite';
import TestRunner from './runner';

export default class TestFramework {

  private testRunner;

  constructor(
    private directoryReader: DirectoryReader,
    private classLoader: ClassLoader,
    reporter: TestReporter,
  ) {
    this.testRunner = new TestRunner(reporter);
  }

  async test(globPattern: string): Promise<void> {
    const testFiles = this.directoryReader.read(globPattern);
    const testSuiteClasses: (new () => TestSuite)[] = [];
    for (const testFile of testFiles) {
      const testSuiteClass = await this.classLoader.load(testFile);
      testSuiteClasses.push(testSuiteClass);
    }
    return this.testRunner.run(testSuiteClasses);
  }
}
