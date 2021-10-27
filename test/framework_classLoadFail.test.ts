import assert from 'assert';
import ClassLoader from '../src/core/classLoader';
import DirectoryReader from '../src/core/directoryReader';
import TestError from '../src/core/error';
import { TestSuite } from '../src/core/suite';
import TestFramework from '../src/impl/framework';

const testPattern = '**/*.test.ts';
const testFiles = ['src/some.test.ts'];

export default async function testFramework_classLoadFail(): Promise<void> {

  const directoryReader = new DirectoryReaderStub();
  const classLoader = new ClassLoaderStub();
  const testFramework = new TestFramework(directoryReader, classLoader);

  await assert.rejects(async () => {
    await testFramework.test(testPattern);
  }, TestError);
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
  load(_filepath: string): Promise<new () => TestSuite> {
    throw new TestError('Could not load test class');
  }
}
