import ClassLoader from '../core/classLoader';
import DirectoryReader from '../core/directoryReader';
import TestSuite from '../core/suite';
import TestReporter from './reporter';
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

  async test(globPatterns: string[]): Promise<void> {
    const testFiles = this.directoryReader.read(globPatterns);
    const testSuiteClasses: (new () => TestSuite)[] = [];
    for (const testFile of testFiles) {
      const testSuiteClass = await this.classLoader.load(testFile);
      testSuiteClasses.push(testSuiteClass);
    }
    return this.testRunner.run(testSuiteClasses);
  }
}
