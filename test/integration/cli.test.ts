import assert from 'assert';
import { execSync } from 'child_process';
import path from 'path';
import { cleanupTestBaseDirectory, createFile, createTestBaseDirectory } from './common';
import config from './config';

const rootDir = path.resolve();

export default [

  function testCli_noTests(): void | Promise<void> {

    createTestBaseDirectory();

    assert.throws(() => {
      runCli(`${config.testDirectory}/**/*.test.ts`);
    });


    cleanupTestBaseDirectory();
  },

  function testCli_passingTest(): void | Promise<void> {

    createTestBaseDirectory();
    createPassingTestFile();

    assert.doesNotThrow(() => {
      runCli(`${config.testDirectory}/**/*.test.ts`);
    });


    cleanupTestBaseDirectory();
  },

  function testCli_passingTest(): void | Promise<void> {

    createTestBaseDirectory();
    createFailingTestFile();

    assert.throws(() => {
      runCli(`${config.testDirectory}/**/*.test.ts`);
    });


    cleanupTestBaseDirectory();
  },

];

function runCli(args: string) {
  execSync(`npx ts-node -T ${rootDir}/src/cli.ts ${args}`, { stdio: 'ignore' });
}

function createPassingTestFile() {
  createFile('example.test.ts', `
    import assert from 'assert';
    import { TestCase, TestSuite } from '${rootDir}/src';
    export default class PassingTest extends TestSuite {
      tests(): TestCase[] {
        return [
          this.test('test', () => { assert.equal(1, 1); }),
        ];
      }
    }
  `);
}

function createFailingTestFile() {
  createFile('example.test.ts', `
    import assert from 'assert';
    import { TestCase, TestSuite } from '${rootDir}/src';
    export default class PassingTest extends TestSuite {
      tests(): TestCase[] {
        return [
          this.test('test', () => { assert.equal(1, 2); }),
        ];
      }
    }
  `);
}
