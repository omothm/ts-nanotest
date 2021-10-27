import assert from 'assert';
import ClassLoader from '../src/core/classLoader';
import DirectoryReader from '../src/core/directoryReader';
import { TestSpecs, TestSuite } from '../src/core/suite';
import TestFramework from '../src/impl/framework';

const testPattern = '**/*.test.ts';
const testFiles = ['src/some.test.ts'];
const testName = 'example test';

export default async function testFramework(): Promise<void> {

  const directoryReader = new DirectoryReaderStub();
  const classLoader = new ClassLoaderStub();
  const framework = new TestFramework(directoryReader, classLoader);

  const report = await framework.test(testPattern);

  assert.equal(report.suites.length, 1);
  assert.equal(report.suites[0].name, TestSuiteStub.name);
  assert.equal(report.suites[0].tests.length, 1);
  assert.equal(report.suites[0].tests[0].name, testName);
  assert.equal(report.suites[0].tests[0].error, null);
}

class DirectoryReaderStub implements DirectoryReader {
  read(globPattern: string): string[] {
    if (globPattern !== testPattern) {
      throw new Error('Not stubbed');
    }
    return testFiles;
  }
}

class ClassLoaderStub implements ClassLoader<TestSuite> {
  load(filepath: string): Promise<new () => TestSuite> {
    if (filepath !== testFiles[0]) {
      throw new Error('Not stubbed');
    }
    return Promise.resolve(TestSuiteStub);
  }
}

class TestSuiteStub extends TestSuite {

  tests(): TestSpecs {
    return {
      [testName]: () => {
        // dummy
      },
    };
  }
}
