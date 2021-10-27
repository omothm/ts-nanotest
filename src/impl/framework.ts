import ClassLoader from '../core/classLoader';
import DirectoryReader from '../core/directoryReader';
import { TestReport } from '../core/report';
import { TestSuite } from '../core/suite';
import TestRunner from './runner';

export default class TestFramework {

  private testRunner = new TestRunner();

  constructor(
    private directoryReader: DirectoryReader,
    private classLoader: ClassLoader<TestSuite>,
  ) { }

  async test(globPattern: string): Promise<TestReport> {
    const testFiles = this.directoryReader.read(globPattern);
    const testSuiteClasses: (new () => TestSuite)[] = [];
    for (const testFile of testFiles) {
      const testSuiteClass = await this.classLoader.load(testFile);
      testSuiteClasses.push(testSuiteClass);
    }
    return this.testRunner.run(testSuiteClasses);
  }
}
