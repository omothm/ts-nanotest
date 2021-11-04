import fs from 'fs';
import assert from 'assert';
import NodeDirectoryReader from '../../src/impl/nodeDirectoryReader';
import config from './config';

export default [

  function testNodeDirectoryReader_noFiles(): void | Promise<void> {

    createTestBaseDirectory();
    const directoryReader = new NodeDirectoryReaderProxy();

    const files = directoryReader.read(['**/*.test.ts']);

    assert.equal(files.length, 0);

    cleanupTestBaseDirectory();
  },

];

function createTestBaseDirectory() {
  cleanupTestBaseDirectory();
  fs.mkdirSync(config.testDirectory, { recursive: true });
}

function cleanupTestBaseDirectory() {
  fs.rmSync(config.testDirectory, { recursive: true, force: true });
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
