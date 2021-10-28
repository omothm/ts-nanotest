import assert from 'assert';
import ClassLoader from '../src/core/classLoader';
import DirectoryReader from '../src/core/directoryReader';
import TestReporter from '../src/core/reporter';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestFramework from '../src/impl/framework';

const testPattern = '**/*.test.ts';
const testFiles = ['src/some.test.ts'];
const testName = 'example test';

export default async function testFramework(): Promise<void> {

  const directoryReader = new DirectoryReaderStub();
  const classLoader = new ClassLoaderStub();
  const reporter = new TestReporter();
  const framework = new TestFramework(directoryReader, classLoader, reporter);

  await framework.test(testPattern);

  const report = reporter.getReport();

  assert.equal(report.length, 1);
  assert.equal(report[0].suite, TestSuiteStub.name);
  assert.equal(report[0].test, testName);
  assert.equal(report[0].error, null);
}

class DirectoryReaderStub implements DirectoryReader {
  read(globPattern: string): string[] {
    if (globPattern !== testPattern) {
      throw new Error('Not stubbed');
    }
    return testFiles;
  }
}

class ClassLoaderStub implements ClassLoader {
  load(filepath: string): Promise<new () => TestSuite> {
    if (filepath !== testFiles[0]) {
      throw new Error('Not stubbed');
    }
    return Promise.resolve(TestSuiteStub);
  }
}

class TestSuiteStub extends TestSuite {

  override tests(): TestSpecs {
    return {
      [testName]: () => {
        // dummy
      },
    };
  }
}
