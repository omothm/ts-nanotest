import path from 'path';
import assert, { AssertionError } from 'assert';
import { ClassLoadError } from '../../src/errors';
import { TestSuite } from '../../src';
import NodeClassLoader from '../../src/impl/nodeClassLoader';
import { cleanupTestBaseDirectory, createFile, createTestBaseDirectory, fullPath } from './common';

export default [

  async function testNodeClassLoader_noFile(): Promise<void> {

    createTestBaseDirectory();
    const classLoader = new NodeClassLoaderProxy();

    await assert.rejects(async () => {
      await classLoader.load('');
    }, ClassLoadError);

    cleanupTestBaseDirectory();
  },

  async function testNodeClassLoader_FileWithTestSuite(): Promise<void> {

    createTestBaseDirectory();
    const filename = 'example.test.ts';
    createTestSuiteFile(filename);
    const classLoader = new NodeClassLoaderProxy();

    const suiteClass = await classLoader.load(fullPath(filename));
    const suite = new suiteClass();
    const tests = suite.tests();

    await assert.rejects(async () => {
      await tests[0].run();
    }, AssertionError);

    cleanupTestBaseDirectory();
  },

  async function testNodeClassLoader_FileWithoutTestSuite(): Promise<void> {

    createTestBaseDirectory();
    // Although the file is recreated, name must be different because node caches imports
    const filename = 'non-suite-example.test.ts';
    createNonTestSuiteFile(filename);
    const classLoader = new NodeClassLoaderProxy();

    await assert.rejects(async () => {
      await classLoader.load(fullPath(filename));
    }, ClassLoadError);

    cleanupTestBaseDirectory();
  },

];

function createTestSuiteFile(filename: string) {
  const rootDir = path.resolve();

  createFile(filename, `
    import assert from 'assert';
    import { TestCase, TestSuite } from '${rootDir}/src';
    export default class ExampleTest extends TestSuite {
      tests(): TestCase[] {
        return [
          this.test('test', () => { assert.equal(1, 2); }),
        ];
      }
    }
  `);
}

function createNonTestSuiteFile(filename: string) {
  createFile(filename, `
    export default {};
  `);
}

class NodeClassLoaderProxy {

  private classLoader: NodeClassLoader;

  constructor() {
    this.classLoader = new NodeClassLoader();
  }

  load(filepath: string): Promise<new () => TestSuite> {
    return this.classLoader.load(filepath);
  }

}
