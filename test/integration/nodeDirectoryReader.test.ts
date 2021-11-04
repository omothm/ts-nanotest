import fs from 'fs';
import path from 'path';
import assert from 'assert';
import NodeDirectoryReader from '../../src/impl/nodeDirectoryReader';
import config from './config';

export default [

  function testNodeDirectoryReader_noPatterns(): void | Promise<void> {

    createTestBaseDirectory();
    const directoryReader = new NodeDirectoryReaderProxy();

    const files = directoryReader.read([]);

    assert.equal(files.length, 0);

    cleanupTestBaseDirectory();
  },

  function testNodeDirectoryReader_noFiles(): void | Promise<void> {

    createTestBaseDirectory();
    const directoryReader = new NodeDirectoryReaderProxy();

    const files = directoryReader.read(['**/*.test.ts']);

    assert.equal(files.length, 0);

    cleanupTestBaseDirectory();
  },

  function testNodeDirectoryReader_singlePattern_singleFile(): void | Promise<void> {

    createTestBaseDirectory();
    const targetFile = 'hello.test.ts';
    createFile(targetFile);
    const directoryReader = new NodeDirectoryReaderProxy();

    const files = directoryReader.read(['**/*.test.ts']);

    assert.equal(files.length, 1);
    assert.equal(files[0], fullPath(targetFile));

    cleanupTestBaseDirectory();
  },

  function testNodeDirectoryReader_singlePattern_manyFiles(): void | Promise<void> {

    createTestBaseDirectory();
    const targetFile1 = 'hello1.test.ts';
    const targetFile2 = 'hello2.test.ts';
    const otherFile = 'hello.ts';
    createFile(targetFile1);
    createFile(targetFile2);
    createFile(otherFile);
    const directoryReader = new NodeDirectoryReaderProxy();

    const allFiles = directoryReader.read(['**/*.ts']);
    const files = directoryReader.read(['**/*.test.ts']);

    assert.equal(allFiles.length, 3);
    assert.equal(files.length, 2);
    assert.equal(files[0], fullPath(targetFile1));
    assert.equal(files[1], fullPath(targetFile2));

    cleanupTestBaseDirectory();
  },

  function testNodeDirectoryReader_singlePattern_deepFiles(): void | Promise<void> {

    createTestBaseDirectory();
    const targetFile1 = 'hello.test.ts';
    const targetFile2 = 'hello.spec.ts';
    const otherFile = 'hello.ts';
    createFile(targetFile1);
    createFile(targetFile2);
    createFile(otherFile);
    const directoryReader = new NodeDirectoryReaderProxy();

    const allFiles = directoryReader.read(['**/*.ts']);
    const files = directoryReader.read(['**/*.test.ts', '**/*.spec.ts']);

    assert.equal(allFiles.length, 3);
    assert.equal(files.length, 2);
    assert.equal(files[0], fullPath(targetFile1));
    assert.equal(files[1], fullPath(targetFile2));

    cleanupTestBaseDirectory();
  },

  function testNodeDirectoryReader_manyPatterns(): void | Promise<void> {

    createTestBaseDirectory();
    const targetFile1 = 'deep/hello2.test.ts';
    const targetFile2 = 'hello1.test.ts';
    const otherFile = 'deep/very/deep/hello.ts';
    createFile(targetFile1);
    createFile(targetFile2);
    createFile(otherFile);
    const directoryReader = new NodeDirectoryReaderProxy();

    const allFiles = directoryReader.read(['**/*.ts']);
    const files = directoryReader.read(['**/*.test.ts']);

    assert.equal(allFiles.length, 3);
    assert.equal(files.length, 2);
    assert.equal(files[0], fullPath(targetFile1));
    assert.equal(files[1], fullPath(targetFile2));

    cleanupTestBaseDirectory();
  },

];

function createTestBaseDirectory() {
  cleanupTestBaseDirectory();
  createDirectoryRecursively(config.testDirectory);
}

function cleanupTestBaseDirectory() {
  fs.rmSync(config.testDirectory, { recursive: true, force: true });
}

function createFile(filename: string) {
  const fileDirectory = path.dirname(filename);
  if (!fs.existsSync(fileDirectory)) {
    createDirectoryRecursively(path.join(config.testDirectory, fileDirectory));
  }
  fs.writeFileSync(fullPath(filename), '');
}

function createDirectoryRecursively(directory: string) {
  fs.mkdirSync(directory, { recursive: true });
}

function fullPath(filename: string) {
  return path.resolve(config.testDirectory, filename);
}

class NodeDirectoryReaderProxy {

  private directoryReader: NodeDirectoryReader;

  constructor() {
    this.directoryReader = new NodeDirectoryReader();
  }

  read(globPatterns: string[]) {
    return this.directoryReader.read(globPatterns, config.testDirectory);
  }

}
